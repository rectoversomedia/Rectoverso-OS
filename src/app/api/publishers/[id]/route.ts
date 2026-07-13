/**
 * Rectoverso OS - Publishers API Route (Single)
 * GET, PATCH, DELETE operations for single publisher
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
const updatePublisherSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['media', 'influencer', 'community', 'local_contributor', 'website', 'social_account', 'whatsapp_group', 'telegram_group']).optional(),
  status: z.enum(['active', 'inactive', 'testing', 'blacklist']).optional(),
  platform: z.string().nullable().optional(),
  handle: z.string().nullable().optional(),
  url: z.string().url().nullable().optional().or(z.literal('')),
  reach: z.number().nullable().optional(),
  engagement_rate: z.number().nullable().optional(),
  quality_score: z.number().nullable().optional(),
  contact_person: z.string().nullable().optional(),
  contact_email: z.string().email().nullable().optional().or(z.literal('')),
  contact_phone: z.string().nullable().optional(),
  rate_card: z.any().nullable().optional(),
  notes: z.string().nullable().optional(),
})

// ============================================
// GET /api/publishers/[id]
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

    const { data: publisher, error } = await supabase
      .from('publishers')
      .select(`
        *,
        campaigns:campaign_publishers(
          *,
          campaign:campaigns(id, name, status)
        )
      `)
      .eq('id', id)
      .single()

    if (error || !publisher) {
      throw new NotFoundError('Publisher not found')
    }

    return apiResponse().success(publisher)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/publishers/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'publishers:update')) {
      return apiResponse().forbidden('You do not have permission to update publishers')
    }

    const body = await request.json()
    const validated = updatePublisherSchema.parse(body)

    const supabase = getSupabase()

    const { data: publisher, error } = await supabase
      .from('publishers')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!publisher) throw new NotFoundError('Publisher not found')

    return apiResponse().success(publisher)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/publishers/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'publishers:delete')) {
      return apiResponse().forbidden('You do not have permission to delete publishers')
    }

    const supabase = getSupabase()

    // Check if publisher is used in active campaigns
    const { data: usage } = await supabase
      .from('campaign_publishers')
      .select('id')
      .eq('publisher_id', id)

    if (usage && usage.length > 0) {
      return Response.json({
        status: 'error',
        error: { code: 'PUBLISHER_IN_USE', message: 'Cannot delete publisher that is assigned to campaigns' }
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('publishers')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
