/**
 * Rectoverso OS - Schedules API Route (Single)
 * GET, PATCH, DELETE operations for single schedule
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
const updateScheduleSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  type: z.enum(['client_meeting', 'internal_meeting', 'deadline', 'campaign_launch', 'review', 'other']).optional(),
  start_datetime: z.string().optional(),
  end_datetime: z.string().nullable().optional(),
  location_type: z.enum(['online', 'offline', 'hybrid']).optional(),
  meeting_link: z.string().url().nullable().optional().or(z.literal('')),
  location_address: z.string().nullable().optional(),
  campaign_id: z.string().nullable().optional(),
  color: z.string().optional(),
  notes: z.string().nullable().optional(),
})

// ============================================
// GET /api/schedules/[id]
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

    const { data: schedule, error } = await supabase
      .from('team_schedules')
      .select(`
        *,
        campaign:campaigns(id, name),
        created_by_user:users!created_by(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error || !schedule) {
      throw new NotFoundError('Schedule not found')
    }

    return apiResponse().success(schedule)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/schedules/[id]
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
      return apiResponse().forbidden('You do not have permission to update schedules')
    }

    const body = await request.json()
    const validated = updateScheduleSchema.parse(body)

    const supabase = getSupabase()

    const { data: schedule, error } = await supabase
      .from('team_schedules')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!schedule) throw new NotFoundError('Schedule not found')

    return apiResponse().success(schedule)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/schedules/[id]
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
      return apiResponse().forbidden('You do not have permission to delete schedules')
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('team_schedules')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
