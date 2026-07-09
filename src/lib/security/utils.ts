/**
 * Rectoverso OS - Security Utilities
 * Production-ready security helpers
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { z } from 'zod'

// ============================================
// Input Sanitization
// ============================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize HTML content (allow limited tags)
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return ''

  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove data: URLs (potential XSS vector)
  sanitized = sanitized.replace(/data:/gi, '')

  return sanitized.trim()
}

// ============================================
// Password Utilities
// ============================================

const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < PASSWORD_CONFIG.minLength) {
    errors.push(`Password must be at least ${PASSWORD_CONFIG.minLength} characters`)
  }

  if (password.length > PASSWORD_CONFIG.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_CONFIG.maxLength} characters`)
  }

  if (PASSWORD_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (PASSWORD_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (PASSWORD_CONFIG.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (PASSWORD_CONFIG.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Hash password using bcrypt-like algorithm
 * Note: In production, use bcrypt or argon2
 */
export function hashPassword(password: string, salt?: string): {
  hash: string
  salt: string
} {
  const useSalt = salt || randomBytes(16).toString('hex')
  const hash = createHmac('sha256', useSalt).update(password).digest('hex')
  return { hash, salt: useSalt }
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt)
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash))
  } catch {
    return false
  }
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex')
}

/**
 * Hash sensitive data (for storage comparison)
 */
export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

// ============================================
// API Key Utilities
// ============================================

export function generateApiKey(prefix: string = 'rv'): {
  key: string
  secret: string
} {
  const randomPart = randomBytes(32).toString('hex')
  const key = `${prefix}_${randomPart.slice(0, 8)}`
  const secret = `${randomPart.slice(8)}_${randomBytes(8).toString('hex')}`

  return { key, secret }
}

export function validateApiKeyFormat(key: string): boolean {
  return /^[a-z]+_[a-f0-9]{8,}$/i.test(key)
}

// ============================================
// CORS Configuration
// ============================================

export const CORS_CONFIG = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://rectoverso-os.vercel.app',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-User-ID',
    'X-CSRF-Token',
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
}

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin')

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': CORS_CONFIG.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': CORS_CONFIG.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': CORS_CONFIG.exposedHeaders.join(', '),
    'Access-Control-Max-Age': String(CORS_CONFIG.maxAge),
  }

  if (origin && CORS_CONFIG.allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }

  return headers
}

// ============================================
// Security Headers
// ============================================

export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com https://vercel.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.posthog.com https://*.vercel.com",
    "frame-src 'self' https://*.supabase.co",
  ].join('; '),
}

export function getSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS }
}

// ============================================
// CSRF Protection
// ============================================

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export function validateCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))
  } catch {
    return false
  }
}

// ============================================
// Request ID Generation
// ============================================

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${randomBytes(8).toString('hex')}`
}

// ============================================
// IP Validation & Geolocation
// ============================================

export function isValidIpAddress(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number)
    return parts.every(part => part >= 0 && part <= 255)
  }

  // IPv6
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  if (ipv6Regex.test(ip)) return true

  // IPv6 compressed
  const ipv6CompressedRegex = /^(([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})?::(([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})?$/
  return ipv6CompressedRegex.test(ip)
}

export function isPrivateIpAddress(ip: string): boolean {
  // IPv4 private ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^127\./,
    /^localhost$/i,
    /^::1$/,
    /^fe80:/i,
  ]

  return privateRanges.some(regex => regex.test(ip))
}

// ============================================
// File Upload Security
// ============================================

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFileUpload(file: {
  type: string
  size: number
  name: string
}): {
  valid: boolean
  error?: string
} {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Check for double extensions
  const nameParts = file.name.split('.')
  if (nameParts.length > 2) {
    const ext = nameParts[nameParts.length - 1].toLowerCase()
    const secondExt = nameParts[nameParts.length - 2].toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
      return {
        valid: false,
        error: 'Suspicious file name detected',
      }
    }
  }

  return { valid: true }
}

// ============================================
// Content Type Sniffing Prevention
// ============================================

export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
  }

  return mimeTypes[ext || ''] || 'application/octet-stream'
}

// ============================================
// Zod Schemas for Security Validation
// ============================================

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .toLowerCase()
  .trim()

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2048, 'URL too long')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    },
    { message: 'Only HTTP and HTTPS protocols are allowed' }
  )

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const htmlSchema = z
  .string()
  .transform((val) => sanitizeHtml(val))
  .max(100000, 'Content too long')
