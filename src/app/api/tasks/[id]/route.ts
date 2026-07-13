/**
 * Rectoverso OS - Tasks API Route (Single)
 * GET, PATCH, DELETE operations for single task
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { updateTaskSchema } from '@/lib/validation/schemas'
import { withAuth } from '../../_lib/auth-middleware'
import { apiResponse } from '../../_lib/response'
import { handleApiError, NotFoundError } from '../../_lib/error-handler'
import { checkPermission } from '@/lib/auth/rbac'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ============================================
// GET /api/tasks/[id]
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

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        campaign:campaigns(id, name, client_id),
        owner:users(id, full_name, avatar_url, role),
        sop:sops(id, title)
      `)
      .eq('id', id)
      .single()

    if (error || !task) {
      throw new NotFoundError('Task not found')
    }

    return apiResponse().success(task)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/tasks/[id]
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
      return apiResponse().forbidden('You do not have permission to update tasks')
    }

    const body = await request.json()
    const validated = updateTaskSchema.parse(body)

    const supabase = getSupabase()

    // Check if task exists and user has permission
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('owner_id')
      .eq('id', id)
      .single()

    if (!existingTask) {
      throw new NotFoundError('Task not found')
    }

    // Check ownership or role permission
    const canUpdate = authResult.auth!.userRole === 'founder' ||
                      authResult.auth!.userRole === 'admin' ||
                      authResult.auth!.userRole === 'campaign_manager' ||
                      authResult.auth!.userRole === 'campaign_ops' ||
                      existingTask.owner_id === authResult.auth!.userId

    if (!canUpdate) {
      return apiResponse().forbidden('You can only update your own tasks')
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        campaign:campaigns(id, name),
        owner:users(id, full_name)
      `)
      .single()

    if (error) throw error

    return apiResponse().success(task)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/tasks/[id]
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
      return apiResponse().forbidden('You do not have permission to delete tasks')
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
