/**
 * Rectoverso OS - Invoices API Route
 * CRUD operations for invoices
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withAuth } from '../_lib/auth-middleware'
import { apiResponse } from '../_lib/response'
import { handleApiError } from '../_lib/error-handler'
import { checkPermission } from '@/lib/auth/rbac'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Validation schemas
const createInvoiceSchema = z.object({
  client_id: z.string().uuid(),
  campaign_id: z.string().uuid().optional().nullable(),
  invoice_number: z.string().min(1),
  amount: z.number().positive(),
  tax: z.number().min(0).optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['not_invoiced', 'invoice_sent', 'waiting_payment', 'partially_paid', 'paid', 'overdue', 'disputed']).optional(),
  notes: z.string().optional(),
})

const updateInvoiceSchema = createInvoiceSchema.partial()

// ============================================
// GET /api/invoices
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20', 10), 100)

    const filters = {
      status: searchParams.getAll('status'),
      client_id: searchParams.get('client_id') ?? undefined,
      overdue: searchParams.get('overdue') === 'true',
    }

    const supabase = getSupabase()

    let query = supabase
      .from('invoices')
      .select(`
        *,
        client:clients(id, name),
        campaign:campaigns(id, name)
      `, { count: 'exact' })

    if (filters.status.length) {
      query = query.in('status', filters.status)
    }
    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id)
    }
    if (filters.overdue) {
      query = query.eq('status', 'overdue')
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    query = query.order('created_at', { ascending: false })

    const { data: invoices, error, count } = await query

    if (error) throw error

    const totalPages = Math.ceil((count ?? 0) / pageSize)

    return apiResponse().paginated(invoices ?? [], {
      page,
      pageSize,
      totalItems: count ?? 0,
      totalPages,
    })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// POST /api/invoices
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'finance:create')) {
      return apiResponse().forbidden('You do not have permission to create invoices')
    }

    const body = await request.json()
    const validated = createInvoiceSchema.parse(body)

    const supabase = getSupabase()

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        client:clients(id, name),
        campaign:campaigns(id, name)
      `)
      .single()

    if (error) throw error

    return apiResponse().created(invoice)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
