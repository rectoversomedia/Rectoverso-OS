/**
 * Rectoverso OS - Clients API Route
 * CRUD operations for clients
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
const createClientSchema = z.object({
  name: z.string().min(2),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  pic_name: z.string().optional(),
  pic_email: z.string().email().optional().or(z.literal('')),
  pic_phone: z.string().optional(),
  pic_whatsapp: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

const updateClientSchema = createClientSchema.partial()

// ============================================
// GET /api/clients
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const supabase = getSupabase()

    // Get clients with campaign stats
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        *,
        campaigns:campaigns(id, name, status, budget, kpi_current, kpi_target)
      `)
      .order('name')

    if (error) throw error

    // Calculate stats for each client
    const clientsWithStats = clients?.map(client => {
      const activeCampaigns = client.campaigns?.filter(
        (c: { status: string }) => c.status === 'running'
      ) || []
      const totalRevenue = 0 // Calculate from invoices
      const outstandingPayment = 0

      return {
        ...client,
        activeCampaigns: activeCampaigns.length,
        totalCampaigns: client.campaigns?.length || 0,
        totalRevenue,
        outstandingPayment,
      }
    })

    return apiResponse().success(clientsWithStats)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// POST /api/clients
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'clients:create')) {
      return apiResponse().forbidden('You do not have permission to create clients')
    }

    const body = await request.json()
    const validated = createClientSchema.parse(body)

    const supabase = getSupabase()

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return apiResponse().created(client)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
