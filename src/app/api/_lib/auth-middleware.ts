/**
 * Rectoverso OS - API Auth Middleware
 * Authentication and authorization middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database'
import { PermissionChecker, type Permission } from '@/lib/auth/rbac'

// ============================================
// Auth Context
// ============================================

export interface AuthContext {
  userId: string
  userEmail: string
  userRole: UserRole
  permissions: Permission[]
  isAuthenticated: boolean
}

export interface AuthenticatedRequest extends NextRequest {
  auth: AuthContext
}

// ============================================
// Auth Helper
// ============================================

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)

  // In production, validate the JWT token
  // For now, we'll use Supabase to validate
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return null
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return null
    }

    const checker = new PermissionChecker(userData.role as UserRole)

    return {
      userId: user.id,
      userEmail: user.email ?? '',
      userRole: userData.role as UserRole,
      permissions: checker.getPermissions(),
      isAuthenticated: true,
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// ============================================
// Auth Middleware Factory
// ============================================

export function withAuth(
  options: {
    required?: boolean
    permissions?: Permission[]
    roles?: UserRole[]
  } = {}
) {
  return async function authMiddleware(
    request: NextRequest
  ): Promise<{
    allowed: boolean
    response?: NextResponse
    auth?: AuthContext
  }> {
    const auth = await getAuthContext(request)

    // Check if authentication is required
    if (options.required !== false && !auth) {
      return {
        allowed: false,
        response: NextResponse.json(
          {
            status: 'error',
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          },
          { status: 401 }
        ),
      }
    }

    if (!auth) {
      return { allowed: true, auth: undefined }
    }

    // Check role requirements
    if (options.roles && options.roles.length > 0) {
      if (!options.roles.includes(auth.userRole)) {
        return {
          allowed: false,
          response: NextResponse.json(
            {
              status: 'error',
              error: {
                code: 'FORBIDDEN',
                message: 'Insufficient permissions',
              },
            },
            { status: 403 }
          ),
          auth,
        }
      }
    }

    // Check permission requirements
    if (options.permissions && options.permissions.length > 0) {
      const checker = new PermissionChecker(auth.userRole)
      const hasAllPermissions = options.permissions.every(p => checker.hasPermission(p))

      if (!hasAllPermissions) {
        return {
          allowed: false,
          response: NextResponse.json(
            {
              status: 'error',
              error: {
                code: 'FORBIDDEN',
                message: 'Missing required permissions',
              },
            },
            { status: 403 }
          ),
          auth,
        }
      }
    }

    return { allowed: true, auth }
  }
}

// ============================================
// Pre-built Middleware
// ============================================

export const requireAuth = withAuth({ required: true })
export const requireAdmin = withAuth({
  required: true,
  roles: ['founder', 'admin'],
})
export const requireManager = withAuth({
  required: true,
  roles: ['founder', 'admin', 'campaign_manager'],
})

// ============================================
// Request Context
// ============================================

export function getRequestContext(request: NextRequest) {
  return {
    requestId: request.headers.get('X-Request-ID') ?? crypto.randomUUID(),
    ip: getClientIp(request),
    userAgent: request.headers.get('User-Agent') ?? 'unknown',
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  return realIp ?? 'unknown'
}
