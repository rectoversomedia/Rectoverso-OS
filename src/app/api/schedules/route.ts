/**
 * Rectoverso OS - Team Schedules API Route
 * CRUD operations for team schedules/events
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withAuth } from '../_lib/auth-middleware'
import { apiResponse } from '../_lib/response'
import { handleApiError } from '../_lib/error-handler'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Validation schemas
const createScheduleSchema = z.object({
  campaign_id: z.string().uuid().optional().nullable(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['client_meeting', 'internal_meeting', 'deadline', 'campaign_launch', 'content_publish', 'report_submission', 'payment_due', 'publisher_delivery', 'other']),
  location_type: z.enum(['offline', 'online', 'hybrid']).optional(),
  location: z.string().optional(),
  meeting_link: z.string().url().optional().or(z.literal('')),
  start_datetime: z.string().datetime(),
  end_datetime: z.string().datetime().optional().nullable(),
  all_day: z.boolean().optional(),
  reminder_minutes: z.number().int().optional(),
  attendees: z.array(z.string().uuid()).optional(),
  is_recurring: z.boolean().optional(),
  recurrence_rule: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

// ============================================
// GET /api/schedules
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaign_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const type = searchParams.get('type')

    const supabase = getSupabase()

    let query = supabase
      .from('team_schedules')
      .select(`
        *,
        campaign:campaigns(id, name),
        creator:users!created_by(id, full_name)
      `)
      .order('start_datetime')

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }
    if (startDate) {
      query = query.gte('start_datetime', startDate)
    }
    if (endDate) {
      query = query.lte('start_datetime', endDate)
    }
    if (type) {
      query = query.eq('type', type)
    }

    const { data: schedules, error } = await query

    if (error) throw error

    return apiResponse().success(schedules)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// POST /api/schedules
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const body = await request.json()
    const validated = createScheduleSchema.parse(body)

    const supabase = getSupabase()

    const { data: schedule, error } = await supabase
      .from('team_schedules')
      .insert({
        ...validated,
        created_by: authResult.auth!.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        campaign:campaigns(id, name)
      `)
      .single()

    if (error) throw error

    return apiResponse().created(schedule)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
