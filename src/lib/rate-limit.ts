/**
 * Simple in-memory rate limiting utility
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  max: number;
  /**
   * Time window in seconds
   */
  window: number;
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  /**
   * Login attempts: 5 per 15 minutes per IP
   */
  LOGIN: { max: 5, window: 15 * 60 },
  /**
   * Signup attempts: 3 per hour per IP
   */
  SIGNUP: { max: 3, window: 60 * 60 },
  /**
   * Password reset: 3 per hour per IP
   */
  PASSWORD_RESET: { max: 3, window: 60 * 60 },
  /**
   * Payment initiation: 10 per minute per IP
   */
  PAYMENT_INIT: { max: 10, window: 60 },
} as const;

/**
 * Clean up expired entries periodically
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Object with `allowed` boolean and `remaining` requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  // If no entry or expired, create new entry
  if (!entry || entry.resetTime < now) {
    store.set(identifier, {
      count: 1,
      resetTime: now + config.window * 1000,
    });
    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime: now + config.window * 1000,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIP(request: Request): string {
  // Check for forwarded IP (proxy/load balancer)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Check for real IP
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback (shouldn't happen in production)
  return "unknown";
}

// Clean up interval on process exit
if (typeof process !== "undefined") {
  process.on("SIGTERM", () => {
    clearInterval(cleanupInterval);
  });
  process.on("SIGINT", () => {
    clearInterval(cleanupInterval);
  });
}
