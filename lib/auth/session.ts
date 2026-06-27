import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { getSql } from '@/lib/db/neon';

export const SESSION_COOKIE_NAME = 'campaign_builder_session';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

const SESSION_DAYS = {
  standard: 1,
  remembered: 30,
};

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createSessionToken() {
  return randomBytes(32).toString('hex');
}

export function getSessionExpiry(remember: boolean) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (remember ? SESSION_DAYS.remembered : SESSION_DAYS.standard));
  return expiresAt;
}

export async function createSession(userId: string, remember: boolean) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = getSessionExpiry(remember);
  const sql = getSql();

  await sql`
    insert into sessions (user_id, token_hash, expires_at)
    values (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export async function clearSession() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const sql = getSql();
    await sql`delete from sessions where token_hash = ${hashSessionToken(token)}`;
  }

  cookies().set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const sql = getSql();
  const rows = await sql`
    select users.id, users.username, users.display_name
    from sessions
    join users on users.id = sessions.user_id
    where sessions.token_hash = ${hashSessionToken(token)}
      and sessions.expires_at > now()
      and users.is_active = true
    limit 1
  ` as unknown as { id: string; username: string; display_name: string }[];

  const user = rows[0];
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
  };
}
