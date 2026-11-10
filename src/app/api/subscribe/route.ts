import { NextResponse } from 'next/server';
import { z } from 'zod';
import xss from 'xss';
import { ratelimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';

export const runtime = 'edge';

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

    // 3. Rate Limiting (48-hour window: 3 requests per 48 hours per IP)
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

    // 4. Database Insertion: STRICTLY PARAMETERIZED QUERIES ONLY
    // AGENT RULE: NEVER use string interpolation/template literals for SQL queries.
    // Example of required format: db.execute('INSERT INTO subscribers (email) VALUES (?)', [email]);
    await db.insertSubscriber(email);

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
