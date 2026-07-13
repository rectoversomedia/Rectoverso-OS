/**
 * Rectoverso OS - Publishers API Route
 * CRUD operations for publishers
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
const createPublisherSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['media', 'influencer', 'community', 'local_contributor', 'website', 'social_account', 'whatsapp_group', 'telegram_group']),
  category: z.string().optional(),
  platform: z.string().optional(),
  handle: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  contact_person: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  rate: z.number().positive().optional(),
  audience_size: z.number().int().min(0).optional(),
  engagement_rate: z.number().min(0).max(100).optional(),
  quality_score: z.number().int().min(1).max(100).optional(),
  status: z.enum(['active', 'inactive', 'testing', 'blacklist']).optional(),
  notes: z.string().optional(),
})

const publisherFilterSchema = z.object({
  type: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  quality_score_min: z.number().optional(),
  quality_score_max: z.number().optional(),
  province: z.string().optional(),
})

// ============================================
// GET /api/publishers
// ============================================

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const { searchParams } = new URL(request.url)

    const filters = {
      type: searchParams.getAll('type'),
      status: searchParams.getAll('status'),
      quality_score_min: searchParams.get('quality_score_min'),
      quality_score_max: searchParams.get('quality_score_max'),
      province: searchParams.get('province'),
    }

    const validatedFilters = publisherFilterSchema.parse(filters)
    const supabase = getSupabase()

    let query = supabase
      .from('publishers')
      .select('*')
      .order('name')

    if (validatedFilters.type?.length) {
      query = query.in('type', validatedFilters.type)
    }
    if (validatedFilters.status?.length) {
      query = query.in('status', validatedFilters.status)
    }
    if (validatedFilters.province) {
      query = query.ilike('province', `%${validatedFilters.province}%`)
    }
    if (validatedFilters.quality_score_min) {
      query = query.gte('quality_score', validatedFilters.quality_score_min)
    }
    if (validatedFilters.quality_score_max) {
      query = query.lte('quality_score', validatedFilters.quality_score_max)
    }

    const { data: publishers, error } = await query

    if (error) throw error

    return apiResponse().success(publishers)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}

// ============================================
// POST /api/publishers
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'publishers:create')) {
      return apiResponse().forbidden('You do not have permission to create publishers')
    }

    const body = await request.json()
    const validated = createPublisherSchema.parse(body)

    const supabase = getSupabase()

    const { data: publisher, error } = await supabase
      .from('publishers')
      .insert({
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return apiResponse().created(publisher)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
