import { NextResponse } from 'next/server';
import { z } from 'zod';
import xss from 'xss';
import { ratelimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';
import { Resend } from 'resend';

export const runtime = 'edge';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// 1. Define a list of common typos to block
const BLOCKED_DOMAINS = [
  'gmail.co', 'gamil.com', 'gmai.com', 'gmail.com.co',
  'yahoo.cm', 'yaho.com', 'yahoo.co',
  'hotmail.co', 'hotmal.com',
  'outlook.co'
];

// 2. Attach the refinement to the existing Zod schema
const subscribeSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address format" })
    .max(254)
    .refine((email) => {
      // Split the email at the '@' and check the domain part
      const domain = email.split('@')[1];
      return !BLOCKED_DOMAINS.includes(domain);
    }, { 
      message: "Check your email domain for typos (e.g., .co instead of .com)" 
    }),
});

// Helper: Generate RFC-compliant signed JWT unsubscribe token (Edge-compatible Web Crypto)
async function generateUnsubscribeToken(email: string): Promise<string> {
  const secret = process.env.JWT_SECRET_KEY || 'x7!KumP2$C!vJ7^fT9$C!vJ7^fT9&h&h';
  const exp = Math.floor(Date.now() / 1000) + (30 * 86400); // 30 days valid

  const b64url = (data: Uint8Array | string) => {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ sub: email, action: 'unsubscribe', exp }));
  const message = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const sig = b64url(new Uint8Array(sigBuf));

  return `${message}.${sig}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
    }

    // 1. XSS Sanitization: Strip any embedded <script> tags or HTML payloads
    const sanitizedInput = xss(body.email);

    // 2. Zod Validation (Pre-Check): Validate email format & domain typos before rate limiting or DB
    const { email } = subscribeSchema.parse({ email: sanitizedInput });

    // 3. Extract and sanitize personalized username for greeting
    const rawName = (body && typeof body.name === 'string' && body.name.trim())
      ? body.name.trim()
      : (email.split('@')[0] || 'Analyst');
    const sanitizedName = xss(rawName);
    const username = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);

    // 4. Rate Limiting (48-hour window: 3 requests per 48 hours per IP)
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';

    try {
      const { success } = await ratelimit.limit(`subscribe_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in 48 hours.' },
          { status: 429 }
        );
      }
    } catch (rlError) {
      console.error('[subscribe] Rate limit check failed:', rlError);
      return NextResponse.json(
        { error: 'Rate limiter unavailable' },
        { status: 500 }
      );
    }

    // 5. Database Insertion: STRICTLY PARAMETERIZED QUERIES ONLY
    await db.insertSubscriber(email);

    // 6. Branded Welcome Email Dispatch
    if (resend) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.urivalent.tech';
        const unsubToken = await generateUnsubscribeToken(email);
        const unsubUrl = `${backendUrl}/auth/unsubscribe?token=${unsubToken}`;

        await resend.emails.send({
          from: 'Urivalent <onboarding@urivalent.tech>', // Must match verified domain
          to: [email], 
          subject: 'Welcome to Urivalent.',
          headers: {
            'List-Unsubscribe': `<${unsubUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
          html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f3f4f6; /* Subtle off-white outer background */
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff; /* Crisp white content background */
          border: 1px solid #9DC88D; /* Sage green border matching news email */
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(22, 74, 65, 0.08);
        }
        .header {
          background-color: #1a4537; /* Deep forest green */
          padding: 32px 20px 24px 20px;
          text-align: center;
          border-bottom: 3px solid #d97706; /* Gold accent line */
        }
        .header-logo {
          display: block;
          max-width: 200px;
          width: 200px;
          height: auto;
          margin: 0 auto 12px auto;
          border: 0;
          outline: none;
        }
        .header-subtitle {
          color: #9ca3af;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 30px;
          color: #374151; /* Dark gray for high readability */
        }
        h1 {
          color: #1a4537; /* Deep forest green heading */
          font-size: 24px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 20px;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .highlight {
          color: #d97706; /* Gold text accent */
          font-weight: 600;
        }
        .btn-container {
          text-align: center;
          margin: 35px 0 15px 0;
        }
        .button {
          display: inline-block;
          background-color: #1a4537; /* Deep green button */
          color: #ffffff !important;
          border: 2px solid #d97706; /* Gold outer border */
          border-radius: 6px;
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .footer {
          text-align: center;
          padding: 25px 20px;
          background-color: #ffffff;
          border-top: 1px solid #9DC88D; /* Sage green border matching news email */
          color: #1a4537; /* Deep forest green footer text */
          font-size: 12px;
          line-height: 1.6;
        }
        .unsub-button {
          display: inline-block;
          padding: 6px 16px;
          border: 1px solid #9DC88D;
          border-radius: 4px;
          color: #164A41;
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <img src="https://urivalent.tech/urivalent_logo.png" alt="Urivalent Logo" class="header-logo" width="200" />
          <div class="header-subtitle">THE EDGE OF TOMORROW</div>
        </div>
        
        <div class="content">
          <h1>Pipeline active.</h1>
          <p>Welcome, <strong style="color: #d97706;">${username}</strong>. Your subscription is confirmed. You are now connected to the Urivalent autonomous intelligence feed.</p>
          <p>Expect high-signal telemetry across <span class="highlight">Silicon &amp; Nanotech, Energy &amp; Infra, Models &amp; Research, Agents &amp; Tooling, Capital &amp; Markets, and Policy &amp; Sovereignty.</span></p>
          <p>We filter the noise, extending your vantage point <span class="highlight">as far as your eyes can see.</span></p>
          
          <div class="btn-container">
            <a href="https://urivalent.tech" class="button">OPEN LIVE INTELLIGENCE TERMINAL &rarr;</a>
          </div>
        </div>
        
        <div class="footer">
          <strong>URIVALENT INTELLIGENCE PIPELINE</strong><br>
          Prepared exclusively for <strong>${username}</strong><br>
          Nairobi, Kenya<br>
          <div style="margin: 14px 0 16px 0;">
            <a href="${unsubUrl}" class="unsub-button">Unsubscribe</a>
          </div>
          &copy; 2026 Urivalent. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `
        });
      } catch (emailErr) {
        console.error('[subscribe] Welcome email dispatch failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid email address format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Validation or Database Error' },
      { status: 400 }
    );
  }
}
