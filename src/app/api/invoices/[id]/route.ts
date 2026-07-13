/**
 * Rectoverso OS - Invoices API Route (Single)
 * GET, PATCH, DELETE operations for single invoice
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
const updateInvoiceSchema = z.object({
  client_id: z.string().optional(),
  campaign_id: z.string().nullable().optional(),
  invoice_number: z.string().optional(),
  amount: z.number().optional(),
  tax: z.number().nullable().optional(),
  total: z.number().optional(),
  status: z.string().optional(),
  issue_date: z.string().optional(),
  due_date: z.string().optional(),
  paid_date: z.string().nullable().optional(),
  paid_amount: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
})

// ============================================
// GET /api/invoices/[id]
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

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, name, contact_person, contact_email),
        campaign:campaigns(id, name)
      `)
      .eq('id', id)
      .single()

    if (error || !invoice) {
      throw new NotFoundError('Invoice not found')
    }

    return apiResponse().success(invoice)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// PATCH /api/invoices/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'finance:update')) {
      return apiResponse().forbidden('You do not have permission to update invoices')
    }

    const body = await request.json()
    const validated = updateInvoiceSchema.parse(body)

    const supabase = getSupabase()

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!invoice) throw new NotFoundError('Invoice not found')

    return apiResponse().success(invoice)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// DELETE /api/invoices/[id]
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

    if (!checkPermission(authResult.auth!.userRole, 'finance:delete')) {
      return apiResponse().forbidden('You do not have permission to delete invoices')
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) throw error

    return apiResponse().success({ deleted: true })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
