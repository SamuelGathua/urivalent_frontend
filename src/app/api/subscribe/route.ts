import { NextResponse } from 'next/server';
import { z } from 'zod';
import xss from 'xss';
import { ratelimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';

// 1. Structural Validation: RFC standard max length is 254
const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' })
    .max(254, { message: 'Payload exceeds allowed length' }),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting (48-hour window: 3 requests per 48 hours per IP)
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';

    const { success } = await ratelimit.limit(`subscribe_${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 48 hours.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
    }

    // 2. XSS Sanitization: Strip any embedded <script> tags or HTML payloads
    const sanitizedInput = xss(body.email);

    // 3. Zod Validation: Ensure it is a structurally valid email after sanitization
    const { email } = subscribeSchema.parse({ email: sanitizedInput });

    // 4. Database Insertion: STRICTLY PARAMETERIZED QUERIES ONLY
    // AGENT RULE: NEVER use string interpolation/template literals for SQL queries.
    // Example of required format: db.execute('INSERT INTO subscribers (email) VALUES (?)', [email]);
    await db.insertSubscriber(email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid email address' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Validation or Database Error' },
      { status: 400 }
    );
  }
}
