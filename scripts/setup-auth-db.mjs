import { neon } from '@neondatabase/serverless';
import { randomBytes, scryptSync } from 'node:crypto';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const sql = neon(databaseUrl);

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

const users = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    username: `client${number}`,
    displayName: `Client ${number}`,
    passwordHash: hashPassword('cb2026'),
  };
});

await sql`create extension if not exists pgcrypto`;

await sql`
  create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    display_name text not null,
    password_hash text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
  )
`;

await sql`create index if not exists sessions_user_id_idx on sessions(user_id)`;
await sql`create index if not exists sessions_expires_at_idx on sessions(expires_at)`;

for (const user of users) {
  await sql`
    insert into users (username, display_name, password_hash, is_active)
    values (${user.username}, ${user.displayName}, ${user.passwordHash}, true)
    on conflict (username) do update set
      display_name = excluded.display_name,
      password_hash = excluded.password_hash,
      is_active = true,
      updated_at = now()
  `;
}

await sql`delete from sessions where expires_at <= now()`;

console.log('Auth database ready');
console.log('Seeded users: client01 - client10');
