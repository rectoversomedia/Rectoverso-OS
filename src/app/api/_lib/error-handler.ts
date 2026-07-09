/**
 * Rectoverso OS - API Error Handler
 * Centralized error handling for API routes
 */

import { ZodError } from 'zod'
import type { NextRequest } from 'next/server'

// ============================================
// Error Types
// ============================================

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(422, 'VALIDATION_ERROR', message, details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, 'FORBIDDEN', message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number = 60) {
    super(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests')
    this.name = 'RateLimitError'
    this.details = { retryAfter: [String(retryAfter)] }
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(500, 'DATABASE_ERROR', message, undefined, false)
    this.name = 'DatabaseError'
    this.stack = originalError?.stack ?? this.stack
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(502, 'EXTERNAL_SERVICE_ERROR', `${service}: ${message}`)
    this.name = 'ExternalServiceError'
  }
}

// ============================================
// Error Handler
// ============================================

interface ErrorHandlerOptions {
  includeStackTrace?: boolean
  logErrors?: boolean
  requestId?: string
}

export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): {
  status: number
  code: string
  message: string
  details?: Record<string, string[]>
  stack?: string
} {
  const { includeStackTrace = false, logErrors = true, requestId } = options

  if (logErrors) {
    logError(error, requestId)
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      if (!details[path]) {
        details[path] = []
      }
      details[path].push(err.message)
    })

    return {
      status: 422,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details,
    }
  }

  // App errors
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
      ...(includeStackTrace && { stack: error.stack }),
    }
  }

  // Supabase errors
  if (isSupabaseError(error)) {
    return {
      status: getSupabaseStatus(error),
      code: 'SUPABASE_ERROR',
      message: getSupabaseMessage(error),
    }
  }

  // Generic errors
  const status = 500
  const code = 'INTERNAL_ERROR'
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : error instanceof Error ? error.message : 'Unknown error'

  return {
    status,
    code,
    message,
    ...(includeStackTrace && { stack: error instanceof Error ? error.stack : undefined }),
  }
}

// ============================================
// Error Logger
// ============================================

function logError(error: unknown, requestId?: string): void {
  const timestamp = new Date().toISOString()
  const errorObj = {
    timestamp,
    requestId,
    type: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  }

  if (error instanceof AppError && !error.isOperational) {
    // Non-operational errors (bugs) should be logged more prominently
    console.error('🔴 CRITICAL ERROR:', JSON.stringify(errorObj, null, 2))
  } else {
    console.warn('⚠️ API Error:', JSON.stringify(errorObj, null, 2))
  }
}

// ============================================
// Supabase Error Utilities
// ============================================

function isSupabaseError(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  )
}

function getSupabaseStatus(error: { code: string }): number {
  const codeMap: Record<string, number> = {
    '23505': 409, // unique_violation
    '23503': 400, // foreign_key_violation
    '23502': 400, // not_null_violation
    '22P02': 400, // invalid_text_representation
    '23514': 400, // check_violation
  }

  return codeMap[error.code] ?? 500
}

function getSupabaseMessage(error: { code: string; message?: string }): string {
  const messageMap: Record<string, string> = {
    '23505': 'A record with this value already exists',
    '23503': 'Referenced record does not exist',
    '23502': 'Required field is missing',
    '22P02': 'Invalid input format',
    '23514': 'Input value violates constraint',
  }

  return messageMap[error.code] ?? error.message ?? 'Database error'
}

// ============================================
// Try-Catch Helper
// ============================================

export async function withErrorHandling<T>(
  handler: () => Promise<Response>,
  options: ErrorHandlerOptions = {}
): Promise<Response> {
  try {
    return await handler()
  } catch (error) {
    const result = handleApiError(error, options)

    return Response.json(
      {
        status: 'error',
        error: {
          code: result.code,
          message: result.message,
          details: result.details,
        },
        meta: {
          requestId: options.requestId ?? crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: result.status }
    )
  }
}

// ============================================
// Async Handler Wrapper
// ============================================

export type ApiHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>

export function withAsyncHandler(handler: ApiHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const requestId = request.headers.get('X-Request-ID') ?? crypto.randomUUID()

    return withErrorHandling(
      () => handler(request, context),
      { requestId }
    )
  }
}

// ============================================
// Validation Helper
// ============================================

export function validateRequest<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        'Validation failed',
        error.errors.reduce((acc, err) => {
          const path = err.path.join('.')
          if (!acc[path]) acc[path] = []
          acc[path].push(err.message)
          return acc
        }, {} as Record<string, string[]>)
      )
    }
    throw error
  }
}
