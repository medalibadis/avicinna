// Web-Crypto compatible authentication & session verification for AVICINNA Admin

const AUTH_SECRET = process.env.ADMIN_SECRET || process.env.WORDPRESS_PREVIEW_SECRET || 'avicinna_super_secure_jwt_secret_key_2026';
const ADMIN_USER = process.env.ADMIN_USER || 'avicinna_core_admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Av!c#99_TrK$Xp2026!mZ';
const ADMIN_PIN = process.env.ADMIN_PIN || '937104'; // 6-digit Master Security PIN

export interface AdminSessionPayload {
  role: 'admin';
  user: string;
  exp: number; // Unix timestamp in ms
  iat: number;
}

// Convert ArrayBuffer to Hex string
function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constant-time comparison using Web Crypto SHA-256 digest + bitwise XOR
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

// Generate HMAC SHA-256 signature using standard Web Crypto API
async function signMessage(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return bufToHex(signatureBuffer);
}

// Create signed session token: Base64(JSON).signature
export async function createAdminSessionToken(user = 'admin'): Promise<string> {
  const payload: AdminSessionPayload = {
    role: 'admin',
    user,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours validity
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = typeof Buffer !== 'undefined'
    ? Buffer.from(payloadJson).toString('base64url')
    : btoa(payloadJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const signature = await signMessage(payloadB64, AUTH_SECRET);
  return `${payloadB64}.${signature}`;
}

// Verify session token
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, providedSignature] = parts;
  if (!payloadB64 || !providedSignature) return null;

  try {
    const expectedSignature = await signMessage(payloadB64, AUTH_SECRET);
    if (expectedSignature !== providedSignature) {
      return null;
    }

    const payloadJson = typeof Buffer !== 'undefined'
      ? Buffer.from(payloadB64, 'base64url').toString('utf8')
      : atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));

    const payload: AdminSessionPayload = JSON.parse(payloadJson);

    // Verify role and expiration
    if (payload.role !== 'admin' || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Server & Middleware session validator
export async function verifyAdminSessionServer(sessionCookie: string | undefined | null): Promise<boolean> {
  if (!sessionCookie) return false;
  const payload = await verifyAdminSessionToken(sessionCookie);
  return payload !== null;
}

// Multi-Factor Administrative credentials validator (Username + Password + 6-digit PIN)
export async function validateAdminCredentials(
  user: string,
  pass: string,
  securityPin?: string
): Promise<boolean> {
  if (!user || !pass) return false;
  
  const cleanUser = user.trim().toLowerCase();
  const validUsers = [ADMIN_USER.toLowerCase(), 'sysadmin@avicinna.com', 'admin@avicinna.com'];
  if (!validUsers.includes(cleanUser)) {
    return false;
  }

  // Timing-safe password check
  const isPassValid = await timingSafeEqualString(pass, ADMIN_PASSWORD);
  if (!isPassValid) {
    return false;
  }

  // If PIN is provided or configured, verify it
  if (securityPin !== undefined && securityPin !== null && securityPin !== '') {
    const isPinValid = await timingSafeEqualString(securityPin.trim(), ADMIN_PIN);
    if (!isPinValid) {
      return false;
    }
  } else if (ADMIN_PIN) {
    // PIN was required but not provided
    return false;
  }

  return true;
}
