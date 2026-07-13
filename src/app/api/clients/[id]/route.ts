/**
 * Rectoverso OS - Clients API Route (Single)
 * GET, PATCH, DELETE operations for single client
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
const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  logo_url: z.string().url().nullable().optional().or(z.literal('')),
  pic_name: z.string().nullable().optional(),
  pic_email: z.string().email().nullable().optional().or(z.literal('')),
  pic_phone: z.string().nullable().optional(),
  pic_whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
})

// ============================================
// GET /api/clients/[id]
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

    // Get client with related data
    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        campaigns(*),
        invoices(*)
      `)
      .eq('id', id)
      .single()

    if (error || !client) {
      throw new NotFoundError('Client not found')
    }

    // Calculate financial stats
    const totalRevenue = client.invoices
      ?.filter((inv: { status: string }) => inv.status === 'paid')
      .reduce((sum: number, inv: { total: number }) => sum + (inv.total || 0), 0) || 0

    const outstandingPayment = client.invoices
      ?.filter((inv: { status: string }) => ['invoice_sent', 'waiting_payment', 'partially_paid', 'overdue'].includes(inv.status))
      .reduce((sum: number, inv: { total: number; paid_amount?: number }) => sum + ((inv.total || 0) - (inv.paid_amount || 0)), 0) || 0

    const clientWithStats = {
      ...client,
      totalRevenue,
      outstandingPayment,
      totalCampaigns: client.campaigns?.length || 0,
      activeCampaigns: client.campaigns?.filter((c: { status: string }) => c.status === 'running').length || 0,
    }

    return apiResponse().success(clientWithStats)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/clients/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'clients:update')) {
      return apiResponse().forbidden('You do not have permission to update clients')
    }

    const body = await request.json()
    const validated = updateClientSchema.parse(body)

    const supabase = getSupabase()

    // Check if client exists
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      throw new NotFoundError('Client not found')
    }

    const { data: client, error } = await supabase
      .from('clients')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return apiResponse().success(client)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/clients/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'clients:delete')) {
      return apiResponse().forbidden('You do not have permission to delete clients')
    }

    const supabase = getSupabase()

    // Check if client has active campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('client_id', id)
      .in('status', ['running', 'setup', 'waiting_brief'])

    if (campaigns && campaigns.length > 0) {
      return Response.json({
        status: 'error',
        error: { code: 'CLIENT_HAS_ACTIVE_CAMPAIGNS', message: 'Cannot delete client with active campaigns' }
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
