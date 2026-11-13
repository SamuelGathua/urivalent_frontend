import { NextResponse } from 'next/server';
import fallbackFeed from '@/lib/fallback_feed.json';

export const runtime = 'edge';

export async function GET() {
  const backendUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.urivalent.tech'
  ).replace(/\/$/, '');

  try {
    const res = await fetch(`${backendUrl}/api/feed`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline or timeout; proceed to resilient cached fallback feed
  }

  // Gracefully return structured feed payload so /feeds never 404s
  return NextResponse.json(fallbackFeed);
}

