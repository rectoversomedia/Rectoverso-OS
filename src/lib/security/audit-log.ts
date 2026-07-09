/**
 * Rectoverso OS - Audit Logging
 * Track all user actions for compliance and debugging
 */

import type { UserRole } from '@/types/database'

// ============================================
// Audit Event Types
// ============================================

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'share'
  | 'status_change'

export type AuditEntityType =
  | 'user'
  | 'client'
  | 'campaign'
  | 'task'
  | 'checklist'
  | 'publisher'
  | 'invoice'
  | 'performance'
  | 'sop'
  | 'client_update'
  | 'system'

export interface AuditLogEntry {
  id: string
  timestamp: Date
  user_id: string
  user_email: string
  user_role: UserRole
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string | null
  entity_name?: string
  metadata: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  request_id: string
  duration_ms?: number
  status: 'success' | 'failure'
  error_message?: string
}

// ============================================
// Audit Log Categories
// ============================================

export const AUDIT_CATEGORIES = {
  authentication: {
    actions: ['login', 'logout'],
    entity: 'system' as AuditEntityType,
    retention: 90, // days
  },
  user_management: {
    actions: ['create', 'update', 'delete', 'status_change'],
    entity: 'user' as AuditEntityType,
    retention: 365,
  },
  campaign_management: {
    actions: ['create', 'update', 'delete', 'status_change', 'approve', 'reject'],
    entity: 'campaign' as AuditEntityType,
    retention: 365,
  },
  task_management: {
    actions: ['create', 'update', 'delete', 'assign', 'status_change'],
    entity: 'task' as AuditEntityType,
    retention: 180,
  },
  financial: {
    actions: ['create', 'update', 'delete', 'export'],
    entity: 'invoice' as AuditEntityType,
    retention: 2555, // 7 years for tax compliance
  },
  data_export: {
    actions: ['export'],
    entity: 'system' as AuditEntityType,
    retention: 365,
  },
} as const

// ============================================
// Audit Log Builder
// ============================================

export class AuditLogBuilder {
  private entry: Partial<AuditLogEntry> = {}

  constructor() {
    this.entry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      metadata: {},
    }
  }

  setUser(
    userId: string,
    userEmail: string,
    userRole: UserRole
  ): this {
    this.entry.user_id = userId
    this.entry.user_email = userEmail
    this.entry.user_role = userRole
    return this
  }

  setAction(action: AuditAction, entityType: AuditEntityType): this {
    this.entry.action = action
    this.entry.entity_type = entityType
    return this
  }

  setEntity(entityId: string | null, entityName?: string): this {
    this.entry.entity_id = entityId
    this.entry.entity_name = entityName
    return this
  }

  setMetadata(metadata: Record<string, unknown>): this {
    this.entry.metadata = {
      ...this.entry.metadata,
      ...metadata,
    }
    return this
  }

  setRequestContext(
    ipAddress: string | null,
    userAgent: string | null,
    requestId: string
  ): this {
    this.entry.ip_address = ipAddress
    this.entry.user_agent = userAgent
    this.entry.request_id = requestId
    return this
  }

  setDuration(durationMs: number): this {
    this.entry.duration_ms = durationMs
    return this
  }

  setStatus(
    status: 'success' | 'failure',
    errorMessage?: string
  ): this {
    this.entry.status = status
    this.entry.error_message = errorMessage
    return this
  }

  build(): AuditLogEntry {
    if (!this.entry.user_id || !this.entry.action || !this.entry.entity_type) {
      throw new Error('AuditLogBuilder: Missing required fields')
    }

    return {
      id: this.entry.id!,
      timestamp: this.entry.timestamp!,
      user_id: this.entry.user_id!,
      user_email: this.entry.user_email!,
      user_role: this.entry.user_role!,
      action: this.entry.action!,
      entity_type: this.entry.entity_type!,
      entity_id: this.entry.entity_id ?? null,
      entity_name: this.entry.entity_name ?? undefined,
      metadata: this.entry.metadata ?? {},
      ip_address: this.entry.ip_address ?? null,
      user_agent: this.entry.user_agent ?? null,
      request_id: this.entry.request_id ?? 'unknown',
      duration_ms: this.entry.duration_ms,
      status: this.entry.status ?? 'success',
      error_message: this.entry.error_message,
    }
  }
}

// ============================================
// Audit Log Service
// ============================================

export class AuditLogService {
  private supabase: SupabaseClient
  private requestId: string

  constructor(supabase: SupabaseClient, requestId?: string) {
    this.supabase = supabase
    this.requestId = requestId ?? crypto.randomUUID()
  }

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const { error } = await this.supabase.from('activity_logs').insert({
        id: entry.id,
        user_id: entry.user_id,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        metadata: entry.metadata,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        created_at: entry.timestamp.toISOString(),
      })

      if (error) {
        console.error('Failed to write audit log:', error)
        // Don't throw - audit logging should not break the main flow
      }
    } catch (error) {
      console.error('Audit log error:', error)
    }
  }

  async query(filters: {
    user_id?: string
    entity_type?: AuditEntityType
    entity_id?: string
    action?: AuditAction
    date_from?: Date
    date_to?: Date
    page?: number
    pageSize?: number
  }): Promise<{
    data: AuditLogEntry[]
    total: number
  }> {
    let query = this.supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type)
    }
    if (filters.entity_id) {
      query = query.eq('entity_id', filters.entity_id)
    }
    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from.toISOString())
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to.toISOString())
    }

    query = query
      .order('created_at', { ascending: false })
      .range(
        ((filters.page ?? 1) - 1) * (filters.pageSize ?? 20),
        (filters.page ?? 1) * (filters.pageSize ?? 20) - 1
      )

    const { data, count, error } = await query

    if (error) throw error

    return {
      data: data as AuditLogEntry[],
      total: count ?? 0,
    }
  }

  getRequestId(): string {
    return this.requestId
  }
}

// ============================================
// Express Middleware Helper
// ============================================

export function createAuditContext(
  supabase: SupabaseClient,
  requestId?: string
) {
  return {
    requestId: requestId ?? crypto.randomUUID(),
    audit: new AuditLogService(supabase),
  }
}

// ============================================
// Pre-built Audit Events
// ============================================

export const AUDIT_EVENTS = {
  // Authentication
  userLogin: (userId: string, email: string, role: UserRole) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('login', 'system')
      .setEntity(null, 'Authentication')
      .setMetadata({ type: 'login' })
      .setStatus('success')
      .build(),

  userLogout: (userId: string, email: string, role: UserRole) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('logout', 'system')
      .setEntity(null, 'Authentication')
      .setMetadata({ type: 'logout' })
      .setStatus('success')
      .build(),

  // Campaign
  campaignCreated: (
    userId: string,
    email: string,
    role: UserRole,
    campaignId: string,
    campaignName: string
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('create', 'campaign')
      .setEntity(campaignId, campaignName)
      .setStatus('success')
      .build(),

  campaignStatusChanged: (
    userId: string,
    email: string,
    role: UserRole,
    campaignId: string,
    campaignName: string,
    fromStatus: string,
    toStatus: string
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('status_change', 'campaign')
      .setEntity(campaignId, campaignName)
      .setMetadata({ from_status: fromStatus, to_status: toStatus })
      .setStatus('success')
      .build(),

  // Invoice
  invoiceCreated: (
    userId: string,
    email: string,
    role: UserRole,
    invoiceId: string,
    invoiceNumber: string,
    amount: number
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('create', 'invoice')
      .setEntity(invoiceId, invoiceNumber)
      .setMetadata({ amount })
      .setStatus('success')
      .build(),

  invoicePaid: (
    userId: string,
    email: string,
    role: UserRole,
    invoiceId: string,
    invoiceNumber: string,
    paidAmount: number
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('update', 'invoice')
      .setEntity(invoiceId, invoiceNumber)
      .setMetadata({ action: 'mark_paid', paid_amount: paidAmount })
      .setStatus('success')
      .build(),

  // Task
  taskAssigned: (
    userId: string,
    email: string,
    role: UserRole,
    taskId: string,
    taskTitle: string,
    assigneeId: string
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('assign', 'task')
      .setEntity(taskId, taskTitle)
      .setMetadata({ assignee_id: assigneeId })
      .setStatus('success')
      .build(),

  // Data Export
  dataExported: (
    userId: string,
    email: string,
    role: UserRole,
    entityType: AuditEntityType,
    filters: Record<string, unknown>
  ) =>
    new AuditLogBuilder()
      .setUser(userId, email, role)
      .setAction('export', 'system')
      .setEntity(null, `Export ${entityType}`)
      .setMetadata({ entity_type: entityType, filters })
      .setStatus('success')
      .build(),
}

// ============================================
// Retention Policy
// ============================================

export const RETENTION_DAYS = {
  standard: 365,
  authentication: 90,
  financial: 2555, // 7 years
  system: 90,
  audit: 2555, // 7 years
}

export async function cleanupOldAuditLogs(
  supabase: SupabaseClient,
  retentionDays: number = RETENTION_DAYS.standard
): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  const { count, error } = await supabase
    .from('activity_logs')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select('*', { count: 'exact', head: true })

  if (error) {
    throw error
  }

  return count ?? 0
}

// Type for Supabase client
type SupabaseClient = {
  from: (table: string) => {
    insert: (data: unknown) => Promise<{ error: Error | null }>
    select: (
      columns?: string,
      options?: { count?: 'exact' | 'planned' | 'estimated' }
    ) => {
      eq: (column: string, value: unknown) => ReturnType<typeof import('@supabase/supabase-js').createClient>['from']
      gte: (column: string, value: unknown) => ReturnType<typeof import('@supabase/supabase-js').createClient>['from']
      lte: (column: string, value: unknown) => ReturnType<typeof import('@supabase/supabase-js').createClient>['from']
      order: (
        column: string,
        options: { ascending: boolean }
      ) => ReturnType<typeof import('@supabase/supabase-js').createClient>['from']
      range: (from: number, to: number) => ReturnType<typeof import('@supabase/supabase-js').createClient>['from']
    }
    delete: () => {
      lt: (
        column: string,
        value: unknown
      ) => {
        select: (
          columns?: string,
          options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }
        ) => Promise<{ count: number | null; error: Error | null }>
      }
    }
  }
}
