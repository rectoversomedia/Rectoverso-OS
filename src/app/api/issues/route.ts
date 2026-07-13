/**
 * Rectoverso OS - Campaign Issues API Route
 * CRUD operations for campaign issues
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
const createIssueSchema = z.object({
  campaign_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'in_progress', 'waiting_external', 'resolved', 'closed']).optional(),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  resolution: z.string().optional(),
})

// ============================================
// GET /api/issues
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaign_id')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const assignedTo = searchParams.get('assigned_to')

    const supabase = getSupabase()

    let query = supabase
      .from('campaign_issues')
      .select(`
        *,
        campaign:campaigns(id, name),
        assigned_user:users!assigned_to(id, full_name),
        reporter:users!reported_by(id, full_name)
      `)
      .order('created_at', { ascending: false })

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (severity) {
      query = query.eq('severity', severity)
    }
    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }

    const { data: issues, error } = await query

    if (error) throw error

    return apiResponse().success(issues)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// POST /api/issues
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const body = await request.json()
    const validated = createIssueSchema.parse(body)

    const supabase = getSupabase()

    const { data: issue, error } = await supabase
      .from('campaign_issues')
      .insert({
        ...validated,
        reported_by: authResult.auth!.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        campaign:campaigns(id, name),
        assigned_user:users!assigned_to(id, full_name)
      `)
      .single()

    if (error) throw error

    return apiResponse().created(issue)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
