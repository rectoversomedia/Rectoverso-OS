/**
 * Rectoverso OS - API Response Helpers
 * Standardized API response utilities
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// API Response Types
// ============================================

export type ApiStatus = 'success' | 'error' | 'fail'

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
  field?: string
}

export interface ApiResponse<T = unknown> {
  status: ApiStatus
  data?: T
  error?: ApiError
  meta?: {
    requestId: string
    timestamp: string
    version: string
  }
}

export interface PaginatedData<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<PaginatedData<T>> {}

// ============================================
// Response Factory
// ============================================

export class ApiResponseFactory {
  private requestId: string
  private version: string = '1.0.0'

  constructor(requestId?: string) {
    this.requestId = requestId ?? crypto.randomUUID()
  }

  private getMeta() {
    return {
      requestId: this.requestId,
      timestamp: new Date().toISOString(),
      version: this.version,
    }
  }

  /**
   * Success response with data
   */
  success<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        status: 'success',
        data,
        meta: this.getMeta(),
      },
      { status }
    )
  }

  /**
   * Created response
   */
  created<T>(data: T): NextResponse<ApiResponse<T>> {
    return this.success(data, 201)
  }

  /**
   * No content response
   */
  noContent(): NextResponse {
    return new NextResponse(null, { status: 204 })
  }

  /**
   * Error response
   */
  error(
    status: number,
    code: string,
    message: string,
    details?: Record<string, string[]>
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code,
          message,
          details,
        },
        meta: this.getMeta(),
      },
      { status }
    )
  }

  /**
   * Bad request error
   */
  badRequest(message: string, details?: Record<string, string[]>): NextResponse<ApiResponse> {
    return this.error(400, 'BAD_REQUEST', message, details)
  }

  /**
   * Unauthorized error
   */
  unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(401, 'UNAUTHORIZED', message)
  }

  /**
   * Forbidden error
   */
  forbidden(message: string = 'Access denied'): NextResponse<ApiResponse> {
    return this.error(403, 'FORBIDDEN', message)
  }

  /**
   * Not found error
   */
  notFound(resource: string = 'Resource'): NextResponse<ApiResponse> {
    return this.error(404, 'NOT_FOUND', `${resource} not found`)
  }

  /**
   * Validation error
   */
  validationError(
    message: string = 'Validation failed',
    details?: Record<string, string[]>
  ): NextResponse<ApiResponse> {
    return this.error(422, 'VALIDATION_ERROR', message, details)
  }

  /**
   * Conflict error
   */
  conflict(message: string): NextResponse<ApiResponse> {
    return this.error(409, 'CONFLICT', message)
  }

  /**
   * Too many requests error
   */
  tooManyRequests(retryAfter?: number): NextResponse<ApiResponse> {
    const response = this.error(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests')
    response.headers.set('Retry-After', String(retryAfter ?? 60))
    return response
  }

  /**
   * Internal server error
   */
  internal(message: string = 'Internal server error'): NextResponse<ApiResponse> {
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : message

    return this.error(500, 'INTERNAL_ERROR', errorMessage)
  }

  /**
   * Service unavailable error
   */
  unavailable(message: string = 'Service unavailable'): NextResponse<ApiResponse> {
    return this.error(503, 'SERVICE_UNAVAILABLE', message)
  }

  /**
   * Paginated response
   */
  paginated<T>(
    items: T[],
    pagination: Omit<PaginatedData<T>['pagination'], 'hasNextPage' | 'hasPreviousPage'>,
    status: number = 200
  ): NextResponse<PaginatedResponse<T>> {
    const { page, pageSize, totalItems, totalPages } = pagination

    return NextResponse.json(
      {
        status: 'success',
        data: {
          items,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
        meta: this.getMeta(),
      },
      { status }
    )
  }
}

// ============================================
// Helper Functions
// ============================================

export function apiResponse(requestId?: string) {
  return new ApiResponseFactory(requestId)
}

export function successResponse<T>(data: T, requestId?: string): NextResponse<ApiResponse<T>> {
  return apiResponse(requestId).success(data)
}

export function createdResponse<T>(data: T, requestId?: string): NextResponse<ApiResponse<T>> {
  return apiResponse(requestId).created(data)
}

export function noContentResponse(): NextResponse {
  return apiResponse().noContent()
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  requestId?: string
): NextResponse<ApiResponse> {
  return apiResponse(requestId).error(status, code, message)
}

// ============================================
// Request ID Helper
// ============================================

export function getRequestId(request: NextRequest): string {
  return request.headers.get('X-Request-ID') ?? crypto.randomUUID()
}

// ============================================
// Response Headers
// ============================================

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
}

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [
    'http://localhost:3000',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400',
    }
  }

  return {}
}
