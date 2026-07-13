/**
 * Rectoverso OS - API Middleware
 * Handles CORS and request preprocessing
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001',
]

// API paths that need CORS
const apiPaths = ['/api/']

/**
 * Get CORS headers for a request
 */
function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')

  // Check if origin is allowed
  if (origin && allowedOrigins.some(allowed =>
    allowed === '*' || origin.startsWith(allowed)
  )) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-User-ID',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    }
  }

  return {}
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle API routes
  if (!apiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    const corsHeaders = getCorsHeaders(request)

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  // For all other API requests, add CORS headers
  const response = NextResponse.next()
  const corsHeaders = getCorsHeaders(request)

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

/**
 * Configure which routes the middleware applies to
 */
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
}
