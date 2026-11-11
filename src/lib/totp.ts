import crypto from 'crypto';
import QRCode from 'qrcode';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateTotpSecret(length = 20): string {
  const randomBytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < randomBytes.length; i++) {
    secret += BASE32_ALPHABET[randomBytes[i] % 32];
  }
  return secret;
}

function base32ToBuffer(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTotpCode(secret: string, timeStepOffset = 0, stepSeconds = 30): string {
  const key = base32ToBuffer(secret);
  const counter = Math.floor(Date.now() / 1000 / stepSeconds) + timeStepOffset;

  const counterBuf = Buffer.alloc(8);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  counterBuf.writeUInt32BE(high, 0);
  counterBuf.writeUInt32BE(low, 4);

  const hmac = crypto.createHmac('sha1', key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(code % 1000000).padStart(6, '0');
}

export function verifyTotpCode(secret: string, token: string, window = 1): boolean {
  if (!secret || !token) return false;
  const cleanToken = token.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanToken)) return false;

  for (let offset = -window; offset <= window; offset++) {
    const expected = generateTotpCode(secret, offset);
    const bufA = Buffer.from(cleanToken, 'utf8');
    const bufB = Buffer.from(expected, 'utf8');
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      return true;
    }
  }
  return false;
}

export function buildOtpAuthUri(username: string, secret: string, issuer = 'AVICINNA'): string {
  const label = encodeURIComponent(`${issuer}:${username}`);
  const iss = encodeURIComponent(issuer);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${iss}&algorithm=SHA1&digits=6&period=30`;
}

export async function generateTotpQrDataUrl(otpAuthUri: string): Promise<string> {
  return QRCode.toDataURL(otpAuthUri, {
    width: 240,
    margin: 2,
    color: {
      dark: '#032654',
      light: '#FFFFFF',
    },
  });
}

