import crypto from "crypto";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store (or Redis in serverless environment)
const ipRateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Hashes an IP address using SHA-256 and a secret salt to guarantee
 * zero raw PII storage, strictly compliant with Tunisian Law 2004-63.
 */
export function hashIpAddress(ip: string, salt: string = process.env.SALT_SECRET || "dardwa-secure-salt"): string {
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

/**
 * Checks and increments rate limit for a hashed IP address.
 * Defaults to max 5 submissions per hour.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = ipRateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    ipRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}

/**
 * Clears the rate limit store (used in tests).
 */
export function resetRateLimitStore() {
  ipRateLimitStore.clear();
}
