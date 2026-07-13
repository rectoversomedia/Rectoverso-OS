/**
 * Rectoverso OS - Campaigns API Route (Single)
 * GET, PATCH, DELETE operations for single campaign
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
const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  client_id: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  health: z.string().optional(),
  description: z.string().nullable().optional(),
  brief_url: z.string().url().nullable().optional().or(z.literal('')),
  objective: z.string().nullable().optional(),
  kpi: z.any().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  pic_id: z.string().nullable().optional(),
  tracking_link: z.string().url().nullable().optional().or(z.literal('')),
  notes: z.string().nullable().optional(),
})

// ============================================
// GET /api/campaigns/[id]
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

    // Get campaign with related data
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        client:clients(id, name, industry, contact_person, contact_email),
        pic:users(id, full_name, avatar_url, role),
        checklists:campaign_checklists(*),
        publishers:campaign_publishers(
          *,
          publisher:publishers(*)
        ),
        tasks(*),
        invoices(*),
        performance:performance_entries(*)
      `)
      .eq('id', id)
      .single()

    if (error || !campaign) {
      throw new NotFoundError('Campaign not found')
    }

    return apiResponse().success(campaign)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/campaigns/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'campaigns:update')) {
      return apiResponse().forbidden('You do not have permission to update campaigns')
    }

    const body = await request.json()
    const validated = updateCampaignSchema.parse(body)

    const supabase = getSupabase()

    // Check if campaign exists
    const { data: existing } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      throw new NotFoundError('Campaign not found')
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        client:clients(id, name),
        pic:users(id, full_name, avatar_url)
      `)
      .single()

    if (error) throw error

    return apiResponse().success(campaign)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/campaigns/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'campaigns:delete')) {
      return apiResponse().forbidden('You do not have permission to delete campaigns')
    }

    const supabase = getSupabase()

    // Check if campaign has active invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id')
      .eq('campaign_id', id)
      .not('status', 'in', '(paid,cancelled)')

    if (invoices && invoices.length > 0) {
      return Response.json({
        status: 'error',
        error: { code: 'CAMPAIGN_HAS_INVOICES', message: 'Cannot delete campaign with active invoices' }
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
