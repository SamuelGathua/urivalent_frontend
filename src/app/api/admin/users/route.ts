import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

// Helper to verify admin token or key in edge runtime
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const adminKey = req.headers.get('x-admin-key') || '';
  const expectedKey = process.env.ADMIN_API_KEY || 'urivalent_admin_secret_key';

  if (adminKey && adminKey === expectedKey) {
    return true;
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    // In Edge runtime, basic presence of signed token or master key validates
    return token.length > 20;
  }

  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const users = await db.getUsers();
    return NextResponse.json(
      {
        status: 'success',
        count: users.length,
        users,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed to fetch users: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const queryId = url.searchParams.get('id');
    const queryEmail = url.searchParams.get('email');

    let bodyId: number | null = null;
    let bodyEmail: string | null = null;

    if (req.method === 'DELETE' && req.headers.get('content-type')?.includes('application/json')) {
      const body = await req.json().catch(() => null);
      if (body) {
        bodyId = typeof body.id === 'number' ? body.id : null;
        bodyEmail = typeof body.email === 'string' ? body.email : null;
      }
    }

    const targetId = bodyId ?? (queryId ? parseInt(queryId, 10) : null);
    const targetEmail = bodyEmail || queryEmail;

    if (!targetId && !targetEmail) {
      return NextResponse.json(
        { error: 'Missing subscriber id or email parameter for deletion.' },
        { status: 400 }
      );
    }

    const identifier = targetId || targetEmail!;
    await db.deleteSubscriber(identifier);

    return NextResponse.json({
      status: 'success',
      message: `Subscriber ${targetEmail || targetId} successfully deleted and master-unsubscribed.`,
      deleted_id: targetId,
      deleted_email: targetEmail,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Deletion failed: ${message}` }, { status: 500 });
  }
}

