import { existsSync, readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pkg = readFileSync('package.json', 'utf8');
const app = readFileSync('app/page.tsx', 'utf8');

assert(pkg.includes('@neondatabase/serverless'), 'Project should use Neon serverless driver');
assert(existsSync('lib/auth/password.ts'), 'Password hashing helper should exist');
assert(existsSync('lib/auth/session.ts'), 'Session helper should exist');
assert(existsSync('lib/db/neon.ts'), 'Neon DB helper should exist');
assert(existsSync('app/api/auth/login/route.ts'), 'Login API route should exist');
assert(existsSync('app/api/auth/logout/route.ts'), 'Logout API route should exist');
assert(existsSync('app/api/auth/me/route.ts'), 'Current-user API route should exist');
assert(existsSync('scripts/setup-auth-db.mjs'), 'Database setup script should exist');

const password = readFileSync('lib/auth/password.ts', 'utf8');
const session = readFileSync('lib/auth/session.ts', 'utf8');
const login = readFileSync('app/api/auth/login/route.ts', 'utf8');

assert(password.includes('scrypt'), 'Password helper should hash passwords with scrypt');
assert(password.includes('timingSafeEqual'), 'Password verification should use timingSafeEqual');
assert(session.includes('campaign_builder_session'), 'Session cookie should use a stable name');
assert(login.includes('password_hash'), 'Login should verify against stored password_hash');
assert(login.includes('remember'), 'Login should support remember-me duration');
assert(app.includes('/api/auth/login'), 'Login form should call the real login API');
assert(app.includes('/api/auth/logout'), 'Logout should call the real logout API');
assert(app.includes('/api/auth/me'), 'App should check current session on load');
assert(!app.includes('DEMO_SESSION_STORAGE_KEY'), 'Fake localStorage login gate should be removed');

console.log('auth foundation verified');
