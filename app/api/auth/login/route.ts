import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import { getSql } from '@/lib/db/neon';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    username?: string;
    password?: string;
    remember?: boolean;
  } | null;

  const username = body?.username?.trim().toLowerCase();
  const password = body?.password ?? '';
  const remember = body?.remember === true;

  if (!username || !password) {
    return NextResponse.json({ message: '請輸入帳號與密碼' }, { status: 400 });
  }

  const sql = getSql();
  const rows = await sql`
    select id, username, display_name, password_hash
    from users
    where username = ${username}
      and is_active = true
    limit 1
  ` as unknown as {
    id: string;
    username: string;
    display_name: string;
    password_hash: string;
  }[];

  const user = rows[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ message: '帳號或密碼不正確' }, { status: 401 });
  }

  await createSession(user.id, remember);

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    },
  });
}
