/**
 * Rectoverso OS - Rate Limiter
 * Production-ready rate limiting for API protection
 */

import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'

// ============================================
// Rate Limit Configuration
// ============================================

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitInfo {
  remaining: number
  limit: number
  reset: Date
  retryAfter?: number
}

// In-memory store for rate limiting (use Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// ============================================
// Default Configurations
// ============================================

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Strict limits for auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  forgotPassword: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },

  // Standard API limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  apiWrite: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },

  // Specific endpoint limits
  campaigns: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50,
  },
  tasks: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  uploads: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
  exports: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },

  // Global default
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
}

// ============================================
// Rate Limit Key Generator
// ============================================

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxy setups)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    'unknown'

  // Include user ID if authenticated
  const userId = request.headers.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }

  return `ip:${ip}`
}

// ============================================
// Rate Limit Checker
// ============================================

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  /**
   * Check if request is allowed
   */
  async isAllowed(request: NextRequest): Promise<{
    allowed: boolean
    info: RateLimitInfo
  }> {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(request)
      : getClientIdentifier(request)

    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Get or create rate limit record
    let record = rateLimitStore.get(key)

    if (!record || record.resetTime < now) {
      // Create new window
      record = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
    }

    // Increment counter
    record.count++

    // Calculate remaining
    const remaining = Math.max(0, this.config.maxRequests - record.count)
    const reset = new Date(record.resetTime)

    // Update store
    rateLimitStore.set(key, record)

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup()
    }

    return {
      allowed: record.count <= this.config.maxRequests,
      info: {
        remaining,
        limit: this.config.maxRequests,
        reset,
        retryAfter: record.count > this.config.maxRequests
          ? Math.ceil((record.resetTime - now) / 1000)
          : undefined,
      },
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }
}

// ============================================
// Middleware Helper
// ============================================

export function createRateLimiter(name: keyof typeof RATE_LIMIT_CONFIGS = 'default') {
  const config = RATE_LIMIT_CONFIGS[name] || RATE_LIMIT_CONFIGS.default
  return new RateLimiter(config)
}

// ============================================
// Hono-compatible Middleware
// ============================================

export function rateLimitMiddleware(config: RateLimitConfig) {
  const limiter = new RateLimiter(config)

  return async (request: NextRequest): Promise<Response | null> => {
    const { allowed, info } = await limiter.isAllowed(request)

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please try again in ${info.retryAfter} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(info.retryAfter),
            'X-RateLimit-Limit': String(info.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': info.reset.toISOString(),
          },
        }
      )
    }

    return null // Continue to handler
  }
}

// ============================================
// Response Headers Helper
// ============================================

export function getRateLimitHeaders(info: RateLimitInfo): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(info.limit),
    'X-RateLimit-Remaining': String(info.remaining),
    'X-RateLimit-Reset': info.reset.toISOString(),
  }
}

// ============================================
// Custom Error Class
// ============================================

export class RateLimitExceededError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public limit: number
  ) {
    super(message)
    this.name = 'RateLimitExceededError'
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(request: NextRequest): RateLimitInfo | null {
  const key = getClientIdentifier(request)
  const record = rateLimitStore.get(key)

  if (!record) return null

  const now = Date.now()
  if (record.resetTime < now) return null

  return {
    remaining: Math.max(0, record.maxRequests - record.count),
    limit: record.maxRequests,
    reset: new Date(record.resetTime),
  }
}

/**
 * Reset rate limit for a specific client
 */
export function resetRateLimit(request: NextRequest): void {
  const key = getClientIdentifier(request)
  rateLimitStore.delete(key)
}

/**
 * Get current store statistics
 */
export function getRateLimitStats(): {
  totalKeys: number
  activeClients: number
  memoryUsage: string
} {
  return {
    totalKeys: rateLimitStore.size,
    activeClients: rateLimitStore.size,
    memoryUsage: `${(JSON.stringify([...rateLimitStore]).length / 1024).toFixed(2)} KB`,
  }
}
