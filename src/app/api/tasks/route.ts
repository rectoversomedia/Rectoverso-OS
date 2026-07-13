/**
 * Rectoverso OS - Tasks API Route
 * CRUD operations for tasks
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '@/lib/validation/schemas'
import { withAuth, getRequestContext } from '../_lib/auth-middleware'
import { apiResponse } from '../_lib/response'
import { handleApiError } from '../_lib/error-handler'
import { createRateLimiter } from '@/lib/security/rate-limit'
import { checkPermission } from '@/lib/auth/rbac'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

const writeLimiter = createRateLimiter('tasks')

// ============================================
// GET /api/tasks
// ============================================

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20', 10), 100)

    // Build filters
    const filters = {
      status: searchParams.getAll('status'),
      priority: searchParams.getAll('priority'),
      campaign_id: searchParams.get('campaign_id') ?? undefined,
      owner_id: searchParams.get('owner_id') ?? undefined,
      due_date_from: searchParams.get('due_date_from') ?? undefined,
      due_date_to: searchParams.get('due_date_to') ?? undefined,
      overdue: searchParams.get('overdue') === 'true',
    }

    const validatedFilters = taskFilterSchema.parse(filters)
    const supabase = getSupabase()

    let query = supabase
      .from('tasks')
      .select(`
        *,
        campaign:campaigns(id, name),
        owner:users(id, full_name, avatar_url)
      `, { count: 'exact' })

    // Apply filters
    if (validatedFilters.status?.length) {
      query = query.in('status', validatedFilters.status)
    }
    if (validatedFilters.priority?.length) {
      query = query.in('priority', validatedFilters.priority)
    }
    if (validatedFilters.campaign_id) {
      query = query.eq('campaign_id', validatedFilters.campaign_id)
    }
    if (validatedFilters.owner_id) {
      query = query.eq('owner_id', validatedFilters.owner_id)
    }
    if (validatedFilters.due_date_from) {
      query = query.gte('due_date', validatedFilters.due_date_from)
    }
    if (validatedFilters.due_date_to) {
      query = query.lte('due_date', validatedFilters.due_date_to)
    }

    // Overdue filter
    if (validatedFilters.overdue) {
      query = query.lt('due_date', new Date().toISOString().split('T')[0])
      query = query.neq('status', 'done')
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    query = query.order('due_date', { ascending: true })

    const { data: tasks, error, count } = await query

    if (error) throw error

    const totalPages = Math.ceil((count ?? 0) / pageSize)

    return apiResponse().paginated(tasks ?? [], {
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
// POST /api/tasks
// ============================================

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!checkPermission(authResult.auth!.userRole, 'tasks:create')) {
      return apiResponse().forbidden('You do not have permission to create tasks')
    }

    const { allowed, info } = await writeLimiter.isAllowed(request)
    if (!allowed) {
      return apiResponse().tooManyRequests(info.retryAfter)
    }

    const body = await request.json()
    const validated = createTaskSchema.parse(body)

    const supabase = getSupabase()

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        campaign:campaigns(id, name),
        owner:users(id, full_name)
      `)
      .single()

    if (error) throw error

    return apiResponse().created(task)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error)
    return Response.json({ status: 'error', error: { code, message, details } }, { status })
  }
}
