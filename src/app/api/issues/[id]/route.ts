/**
 * Rectoverso OS - Issues API Route (Single)
 * GET, PATCH, DELETE operations for single issue
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withAuth } from '../../_lib/auth-middleware'
import { apiResponse } from '../../_lib/response'
import { handleApiError, NotFoundError } from '../../_lib/error-handler'
import { checkPermission } from '@/lib/auth/rbac'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Update schema
const updateIssueSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  campaign_id: z.string().nullable().optional(),
  assigned_to: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  resolution: z.string().nullable().optional(),
})

// ============================================
// GET /api/issues/[id]
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const supabase = getSupabase()

    const { data: issue, error } = await supabase
      .from('campaign_issues')
      .select(`
        *,
        campaign:campaigns(id, name),
        assignee:users!assigned_to(id, full_name, avatar_url),
        reporter:users!reporter_id(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error || !issue) {
      throw new NotFoundError('Issue not found')
    }

    return apiResponse().success(issue)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/issues/[id]
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'tasks:update')) {
      return apiResponse().forbidden('You do not have permission to update issues')
    }

    const body = await request.json()
    const validated = updateIssueSchema.parse(body)

    const supabase = getSupabase()

    const { data: issue, error } = await supabase
      .from('campaign_issues')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!issue) throw new NotFoundError('Issue not found')

    return apiResponse().success(issue)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/issues/[id]
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'tasks:delete')) {
      return apiResponse().forbidden('You do not have permission to delete issues')
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('campaign_issues')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
