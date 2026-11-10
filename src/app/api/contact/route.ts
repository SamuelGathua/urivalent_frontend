import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import xss from 'xss';
import { ratelimit } from '@/lib/ratelimit';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting (48-hour window: 3 requests per 48 hours per IP)
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';

    const { success } = await ratelimit.limit(`contact_${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 48 hours.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { name, email, message } = body;
    if (
      !name ||
      typeof name !== 'string' ||
      !email ||
      typeof email !== 'string' ||
      !message ||
      typeof message !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 2. Strip HTML payloads before sending to Resend
    const safeName = xss(name.trim());
    const safeEmail = xss(email.trim().toLowerCase());
    const safeMessage = xss(message.trim());

    if (!safeEmail.includes('@') || safeEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!resend) {
      // In development or if api key not yet provided
      console.warn('RESEND_API_KEY is not defined. Email simulated:', { safeName, safeEmail });
      return NextResponse.json({ success: true, simulated: true }, { status: 200 });
    }

    // 3. Dispatch Email
    const senderEmail = process.env.SENDER_EMAIL || 'notifications@urivalent.tech';
    const receivingEmail = process.env.CONTACT_RECEIVING_EMAIL || 'contact@urivalent.tech';

    const data = await resend.emails.send({
      from: `Urivalent <${senderEmail}>`,
      to: [receivingEmail],
      subject: `Urivalent Inquiry from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      replyTo: safeEmail,
    });

    if (data.error) {
      console.error('Resend dispatch error:', data.error);
      return NextResponse.json({ error: data.error.message || 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Contact pipeline exception:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

