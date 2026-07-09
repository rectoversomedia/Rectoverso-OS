/**
 * Rectoverso OS - Campaign API Route Handler
 * Production-ready API routes for campaigns
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createCampaignSchema, updateCampaignSchema, campaignFilterSchema } from '@/lib/validation/schemas'
import { withAuth, getRequestContext } from '../_lib/auth-middleware'
import { apiResponse } from '../_lib/response'
import { handleApiError, ValidationError, NotFoundError, UnauthorizedError } from '../_lib/error-handler'
import { createRateLimiter } from '@/lib/security/rate-limit'
import { checkPermission } from '@/lib/auth/rbac'
import { AuditLogBuilder, AUDIT_EVENTS } from '@/lib/security/audit-log'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Rate limiter for write operations
const writeLimiter = createRateLimiter('campaigns')

// ============================================
// GET /api/campaigns
// ============================================

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check authentication
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!authResult.auth) {
      throw new UnauthorizedError()
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20', 10), 100)
    const sortBy = searchParams.get('sortBy') ?? 'created_at'
    const sortOrder = searchParams.get('sortOrder') ?? 'desc'

    // Build filter object
    const filters = {
      status: searchParams.getAll('status'),
      health: searchParams.getAll('health'),
      type: searchParams.getAll('type'),
      client_id: searchParams.get('client_id') ?? undefined,
      pic_id: searchParams.get('pic_id') ?? undefined,
    }

    // Validate filters
    const validatedFilters = campaignFilterSchema.parse(filters)

    // Build query
    const supabase = getSupabase()

    let query = supabase
      .from('campaigns')
      .select(`
        *,
        client:clients(id, name, logo_url),
        pic:users(id, name, avatar_url)
      `, { count: 'exact' })

    // Apply filters
    if (validatedFilters.status?.length) {
      query = query.in('status', validatedFilters.status)
    }
    if (validatedFilters.health?.length) {
      query = query.in('health', validatedFilters.health)
    }
    if (validatedFilters.type?.length) {
      query = query.in('type', validatedFilters.type)
    }
    if (validatedFilters.client_id) {
      query = query.eq('client_id', validatedFilters.client_id)
    }
    if (validatedFilters.pic_id) {
      query = query.eq('pic_id', validatedFilters.pic_id)
    }

    // Apply sorting
    query = query.order(sortBy as any, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    // Execute query
    const { data: campaigns, error, count } = await query

    if (error) {
      throw error
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count ?? 0) / pageSize)

    // Log audit
    const { requestId } = getRequestContext(request)
    new AuditLogBuilder()
      .setUser(authResult.auth.userId, authResult.auth.userEmail, authResult.auth.userRole)
      .setAction('read', 'campaign')
      .setEntity(null, 'Campaign list')
      .setMetadata({ filters: validatedFilters, page, pageSize })
      .setRequestContext(getClientIp(request), request.headers.get('User-Agent') ?? null, requestId)
      .setDuration(Date.now() - startTime)
      .setStatus('success')
      .build()

    return apiResponse(requestId).paginated(campaigns ?? [], {
      page,
      pageSize,
      totalItems: count ?? 0,
      totalPages,
    })
  } catch (error) {
    const { status, code, message, details } = handleApiError(error, {
      requestId: request.headers.get('X-Request-ID'),
    })

    return Response.json(
      {
        status: 'error',
        error: { code, message, details },
      },
      { status }
    )
  }
}

// ============================================
// POST /api/campaigns
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check authentication
    const authResult = await withAuth()(request)
    if (!authResult.allowed) {
      return authResult.response!
    }

    if (!authResult.auth) {
      throw new UnauthorizedError()
    }

    // Check permission
    if (!checkPermission(authResult.auth.userRole, 'campaigns:create')) {
      return apiResponse().forbidden('You do not have permission to create campaigns')
    }

    // Rate limiting
    const { allowed, info } = await writeLimiter.isAllowed(request)
    if (!allowed) {
      return apiResponse().tooManyRequests(info.retryAfter)
    }

    // Parse and validate body
    const body = await request.json()
    const validated = createCampaignSchema.parse(body)

    const supabase = getSupabase()

    // Create campaign
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        client:clients(id, name, logo_url),
        pic:users(id, name, avatar_url)
      `)
      .single()

    if (error) {
      throw error
    }

    // Generate initial checklists based on campaign type
    await generateChecklists(supabase, campaign.id, campaign.type)

    // Log audit
    const { requestId } = getRequestContext(request)
    AUDIT_EVENTS.campaignCreated(
      authResult.auth.userId,
      authResult.auth.userEmail,
      authResult.auth.userRole,
      campaign.id,
      campaign.name
    )

    return apiResponse(requestId).created(campaign)
  } catch (error) {
    const { status, code, message, details } = handleApiError(error, {
      requestId: request.headers.get('X-Request-ID'),
    })

    return Response.json(
      {
        status: 'error',
        error: { code, message, details },
      },
      { status }
    )
  }
}

// ============================================
// Helper Functions
// ============================================

async function generateChecklists(
  supabase: ReturnType<typeof createClient>,
  campaignId: string,
  campaignType: string
) {
  const phases = ['preparation', 'setup', 'execution', 'monitoring', 'reporting', 'finance']

  const checklistsByType: Record<string, { phase: string; title: string }[]> = {
    lead_generation: [
      { phase: 'preparation', title: 'Receive and review client brief' },
      { phase: 'preparation', title: 'Define target audience and KPIs' },
      { phase: 'preparation', title: 'Prepare tracking links and landing page' },
      { phase: 'setup', title: 'Set up campaign in ad platform' },
      { phase: 'setup', title: 'Configure tracking pixels' },
      { phase: 'setup', title: 'Brief and onboard publishers' },
      { phase: 'execution', title: 'Launch campaign' },
      { phase: 'execution', title: 'Monitor initial performance' },
      { phase: 'monitoring', title: 'Daily performance QC' },
      { phase: 'monitoring', title: 'Optimize underperforming placements' },
      { phase: 'reporting', title: 'Prepare mid-campaign report' },
      { phase: 'reporting', title: 'Send client update' },
      { phase: 'finance', title: 'Generate invoice' },
      { phase: 'finance', title: 'Send invoice to client' },
    ],
    app_download: [
      { phase: 'preparation', title: 'Review app store listing' },
      { phase: 'preparation', title: 'Set up app tracking' },
      { phase: 'setup', title: 'Configure deep links' },
      { phase: 'setup', title: 'Set up retargeting audiences' },
      { phase: 'execution', title: 'Launch App Install campaign' },
      { phase: 'monitoring', title: 'Monitor install rates' },
      { phase: 'monitoring', title: 'Track in-app events' },
      { phase: 'reporting', title: 'Prepare performance report' },
      { phase: 'finance', title: 'Generate and send invoice' },
    ],
    default: [
      { phase: 'preparation', title: 'Receive and review brief' },
      { phase: 'setup', title: 'Set up tracking' },
      { phase: 'execution', title: 'Launch campaign' },
      { phase: 'monitoring', title: 'Monitor performance' },
      { phase: 'reporting', title: 'Prepare final report' },
      { phase: 'finance', title: 'Generate invoice' },
    ],
  }

  const checklists = checklistsByType[campaignType] ?? checklistsByType.default

  const { error } = await supabase.from('campaign_checklists').insert(
    checklists.map((item, index) => ({
      campaign_id: campaignId,
      phase: item.phase,
      title: item.title,
      status: 'todo',
      order: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  )

  if (error) {
    console.error('Failed to generate checklists:', error)
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() ?? 'unknown'
}
