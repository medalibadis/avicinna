import type { AdminRole } from '@/types/cms';

const AUTH_SECRET =
  process.env.ADMIN_SECRET ||
  process.env.WORDPRESS_PREVIEW_SECRET ||
  'avicinna_super_secure_jwt_secret_key_2026';

export interface AdminSessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: AdminRole;
  tokenVersion: number;
  exp: number; // Unix timestamp in ms
  iat: number;
}

function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const encoder = new TextEncoder();
  const hashA = await crypto.subtle.digest('SHA-256', encoder.encode(a));
  const hashB = await crypto.subtle.digest('SHA-256', encoder.encode(b));

  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);

  let mismatch = 0;
  for (let i = 0; i < bytesA.length; i++) {
    mismatch |= bytesA[i] ^ bytesB[i];
  }
  return mismatch === 0;
}

async function signMessage(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return bufToHex(signatureBuffer);
}

export async function createAdminSessionToken(params: {
  userId?: string;
  username?: string;
  fullName?: string;
  role?: AdminRole;
  tokenVersion?: number;
}): Promise<string> {
  const payload: AdminSessionPayload = {
    userId: params.userId || 'usr-root-admin',
    username: params.username || 'avicinna_core_admin',
    fullName: params.fullName || 'AVICINNA Administrator',
    role: params.role || 'admin',
    tokenVersion: params.tokenVersion || 1,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(payloadJson).toString('base64url')
      : btoa(payloadJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const signature = await signMessage(payloadB64, AUTH_SECRET);
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, providedSignature] = parts;
  if (!payloadB64 || !providedSignature) return null;

  try {
    const expectedSignature = await signMessage(payloadB64, AUTH_SECRET);
    const sigValid = await timingSafeEqualString(expectedSignature, providedSignature);
    if (!sigValid) {
      return null;
    }

    const payloadJson =
      typeof Buffer !== 'undefined'
        ? Buffer.from(payloadB64, 'base64url').toString('utf8')
        : atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));

    const payload = JSON.parse(payloadJson) as Partial<AdminSessionPayload> & { user?: string };
    const validRole = payload.role === 'admin' || payload.role === 'editor' || payload.role === 'coordinator';
    if (!validRole || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return {
      userId: payload.userId || 'usr-root-admin',
      username: payload.username || payload.user || 'avicinna_core_admin',
      fullName: payload.fullName || payload.username || 'Administrator',
      role: payload.role as AdminRole,
      tokenVersion: payload.tokenVersion ?? 1,
      iat: payload.iat || Date.now(),
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSessionServer(sessionCookie: string | undefined | null): Promise<boolean> {
  if (!sessionCookie) return false;
  const payload = await verifyAdminSessionToken(sessionCookie);
  return payload !== null;
}

export function extractTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match =
    cookieHeader.match(/avicinna_admin_session=([^;]+)/) ||
    cookieHeader.match(/avicinna_session=([^;]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}
