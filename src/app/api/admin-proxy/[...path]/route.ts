import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const CLOUD_API_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.urivalent.tech'
).replace(/\/$/, '');

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path ? path.join('/') : '';
  const searchParams = req.nextUrl.search;
  const targetUrl = `${CLOUD_API_URL}/${targetPath}${searchParams}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (['authorization', 'content-type', 'accept', 'x-admin-key'].includes(lower)) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  try {
    const res = await fetch(targetUrl, init);
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Cloud proxy error: ${msg}` },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const DELETE = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;

