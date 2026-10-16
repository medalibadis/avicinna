// In-Memory Rate Limiting, IP Lockout & Brute-Force Defense for AVICINNA Admin

interface AttemptRecord {
  failedAttempts: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

// In-memory sliding window cache
const attemptsCache = new Map<string, AttemptRecord>();

// Configuration parameters
const MAX_FAILED_ATTEMPTS = 5;       // Lockout after 5 failed attempts
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_DURATION_MS  = 15 * 60 * 1000; // 15 minutes sliding window

// Extract client IP from standard proxy headers
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

// Check if an IP address is currently locked out
export function isIpLockedOut(ip: string): { locked: boolean; retryAfterSeconds: number } {
  const record = attemptsCache.get(ip);
  if (!record || !record.lockedUntil) {
    return { locked: false, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  if (now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { locked: true, retryAfterSeconds };
  }

  // Lockout expired, clean up
  attemptsCache.delete(ip);
  return { locked: false, retryAfterSeconds: 0 };
}

// Register a failed attempt and determine if lockout should trigger
export function recordFailedAttempt(ip: string): {
  locked: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let record = attemptsCache.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_DURATION_MS) {
    // Start new tracking window
    record = {
      failedAttempts: 1,
      firstAttempt: now,
      lockedUntil: null,
    };
    attemptsCache.set(ip, record);
    return {
      locked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS - 1,
      retryAfterSeconds: 0,
    };
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    const retryAfterSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return {
      locked: true,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return {
    locked: false,
    remainingAttempts: remaining,
    retryAfterSeconds: 0,
  };
}

// Clear attempts on successful login
export function resetIpAttempts(ip: string): void {
  attemptsCache.delete(ip);
}

// Instant ban for bot honeypot traps (15 minutes immediately)
export function triggerHoneypotBan(ip: string): number {
  const now = Date.now();
  const retryAfterSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
  attemptsCache.set(ip, {
    failedAttempts: MAX_FAILED_ATTEMPTS,
    firstAttempt: now,
    lockedUntil: now + LOCKOUT_DURATION_MS,
  });
  return retryAfterSeconds;
}

// Artificial delay (Tarpit) to defeat multi-threaded brute force bots
export async function enforceTarpitDelay(ms = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
