/**
 * Rectoverso OS - Zod Validation Schemas
 * Production-ready validation for all entities
 */

import { z } from 'zod'
import { createZodEnum } from '@/lib/utils/zod'

// ============================================
// Common Schemas
// ============================================

export const idSchema = z.string().uuid()

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const searchSchema = z.object({
  search: z.string().optional(),
  searchFields: z.array(z.string()).optional(),
})

// ============================================
// User Schemas
// ============================================

export const userRoleSchema = createZodEnum([
  'founder',
  'admin',
  'campaign_manager',
  'campaign_ops',
  'finance',
  'sales',
  'intern',
])

export const createUserSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  role: userRoleSchema.optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial()

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama harus diisi'),
  newPassword: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka')
    .regex(/[^A-Za-z0-9]/, 'Password harus mengandung karakter khusus'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token harus diisi'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka')
    .regex(/[^A-Za-z0-9]/, 'Password harus mengandung karakter khusus'),
})

// ============================================
// Client Schemas
// ============================================

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nama client minimal 2 karakter').max(200, 'Nama maksimal 200 karakter'),
  industry: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Website tidak valid').optional().or(z.literal('')),
  logo_url: z.string().url('URL logo tidak valid').optional(),
})

export const updateClientSchema = createClientSchema.partial()

// ============================================
// Campaign Schemas
// ============================================

export const campaignStatusSchema = createZodEnum([
  'draft',
  'waiting_brief',
  'setup',
  'running',
  'reporting',
  'completed',
  'paused',
  'problem',
])

export const healthStatusSchema = createZodEnum(['green', 'yellow', 'red'])

export const campaignTypeSchema = createZodEnum([
  'lead_generation',
  'app_download',
  'registration',
  'vcbl',
  'influencer_campaign',
  'publisher_distribution',
  'media_placement',
  'performance_campaign',
  'social_amplification',
])

export const createCampaignSchema = z.object({
  client_id: z.string().uuid('ID client tidak valid'),
  name: z.string().min(2, 'Nama campaign minimal 2 karakter').max(200, 'Nama maksimal 200 karakter'),
  type: campaignTypeSchema,
  status: campaignStatusSchema.optional(),
  description: z.string().optional(),
  brief_url: z.string().url('URL brief tidak valid').optional().or(z.literal('')),
  objective: z.string().optional(),
  kpi: z.record(z.string(), z.any()).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  budget: z.number().positive('Budget harus angka positif').optional(),
  pic_id: z.string().uuid('ID PIC tidak valid').optional(),
  tracking_link: z.string().url('Tracking link tidak valid').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.string().uuid(),
})

export const campaignFilterSchema = z.object({
  status: campaignStatusSchema.array().optional(),
  health: healthStatusSchema.array().optional(),
  type: campaignTypeSchema.array().optional(),
  client_id: z.string().uuid().optional(),
  pic_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
})

// ============================================
// Task Schemas
// ============================================

export const taskStatusSchema = createZodEnum(['todo', 'in_progress', 'review', 'done', 'blocked'])

export const taskPrioritySchema = createZodEnum(['low', 'medium', 'high', 'urgent'])

export const createTaskSchema = z.object({
  campaign_id: z.string().uuid('ID campaign tidak valid').optional().nullable(),
  title: z.string().min(2, 'Judul task minimal 2 karakter').max(200, 'Judul maksimal 200 karakter'),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  owner_id: z.string().uuid('ID owner tidak valid').optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  estimated_hours: z.number().positive().optional(),
  sop_id: z.string().uuid('ID SOP tidak valid').optional().nullable(),
  parent_task_id: z.string().uuid('ID parent task tidak valid').optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid(),
})

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid(),
  status: taskStatusSchema,
})

export const taskFilterSchema = z.object({
  status: taskStatusSchema.array().optional(),
  priority: taskPrioritySchema.array().optional(),
  campaign_id: z.string().uuid().optional(),
  owner_id: z.string().uuid().optional(),
  due_date_from: z.string().datetime().optional(),
  due_date_to: z.string().datetime().optional(),
  overdue: z.boolean().optional(),
})

// ============================================
// Checklist Schemas
// ============================================

export const checklistPhaseSchema = createZodEnum([
  'preparation',
  'setup',
  'execution',
  'monitoring',
  'reporting',
  'finance',
])

export const checklistStatusSchema = createZodEnum(['todo', 'in_progress', 'done', 'blocked'])

export const createChecklistSchema = z.object({
  campaign_id: z.string().uuid('ID campaign tidak valid'),
  title: z.string().min(2, 'Judul checklist minimal 2 karakter').max(200),
  phase: checklistPhaseSchema,
  status: checklistStatusSchema.optional(),
  order: z.number().int().optional(),
  owner_id: z.string().uuid().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
})

export const updateChecklistSchema = createChecklistSchema.partial().extend({
  id: z.string().uuid(),
})

// ============================================
// Publisher Schemas
// ============================================

export const publisherTypeSchema = createZodEnum([
  'media',
  'influencer',
  'community',
  'local_contributor',
  'website',
  'social_account',
  'whatsapp_group',
  'telegram_group',
])

export const publisherStatusSchema = createZodEnum(['active', 'inactive', 'testing', 'blacklist'])

export const createPublisherSchema = z.object({
  name: z.string().min(2, 'Nama publisher minimal 2 karakter').max(200),
  type: publisherTypeSchema,
  status: publisherStatusSchema.optional(),
  platform: z.string().optional(),
  handle: z.string().optional(),
  url: z.string().url('URL tidak valid').optional().or(z.literal('')),
  reach: z.number().int().min(0).optional(),
  engagement_rate: z.number().min(0).max(100).optional(),
  quality_score: z.number().int().min(1).max(10).optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  rate_card: z.record(z.string(), z.any()).optional(),
  notes: z.string().optional(),
})

export const updatePublisherSchema = createPublisherSchema.partial().extend({
  id: z.string().uuid(),
})

export const publisherFilterSchema = z.object({
  type: publisherTypeSchema.array().optional(),
  status: publisherStatusSchema.array().optional(),
  quality_score_min: z.number().int().min(1).max(10).optional(),
  quality_score_max: z.number().int().min(1).max(10).optional(),
  reach_min: z.number().int().optional(),
  reach_max: z.number().int().optional(),
})

// ============================================
// Campaign Publisher Assignment
// ============================================

export const assignPublisherSchema = z.object({
  campaign_id: z.string().uuid('ID campaign tidak valid'),
  publisher_id: z.string().uuid('ID publisher tidak valid'),
  budget: z.number().positive().optional(),
})

export const updateAssignmentSchema = z.object({
  id: z.string().uuid(),
  budget: z.number().positive().optional(),
  allocated: z.boolean().optional(),
})

// ============================================
// Performance Entry Schemas
// ============================================

export const createPerformanceEntrySchema = z.object({
  campaign_id: z.string().uuid('ID campaign tidak valid'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  impressions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  leads: z.number().int().min(0).optional(),
  conversions: z.number().int().min(0).optional(),
  spend: z.number().min(0).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export const updatePerformanceEntrySchema = createPerformanceEntrySchema.partial().extend({
  id: z.string().uuid(),
})

export const performanceFilterSchema = z.object({
  campaign_id: z.string().uuid().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

// ============================================
// Invoice Schemas
// ============================================

export const paymentStatusSchema = createZodEnum([
  'not_invoiced',
  'invoice_sent',
  'waiting_payment',
  'partially_paid',
  'paid',
  'overdue',
  'disputed',
])

export const createInvoiceSchema = z.object({
  client_id: z.string().uuid('ID client tidak valid'),
  campaign_id: z.string().uuid('ID campaign tidak valid').optional().nullable(),
  invoice_number: z.string().min(1, 'Nomor invoice harus diisi').max(50),
  amount: z.number().positive('Amount harus angka positif'),
  tax: z.number().min(0).optional(),
  status: paymentStatusSchema.optional(),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  notes: z.string().optional(),
  file_url: z.string().url().optional().or(z.literal('')),
}).refine(
  (data) => {
    const issueDate = new Date(data.issue_date)
    const dueDate = new Date(data.due_date)
    return dueDate >= issueDate
  },
  {
    message: 'Due date tidak boleh sebelum issue date',
    path: ['due_date'],
  }
)

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string().uuid(),
})

export const recordPaymentSchema = z.object({
  id: z.string().uuid(),
  paid_amount: z.number().positive('Jumlah pembayaran harus positif'),
  paid_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  notes: z.string().optional(),
})

export const invoiceFilterSchema = z.object({
  status: paymentStatusSchema.array().optional(),
  client_id: z.string().uuid().optional(),
  overdue: z.boolean().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

// ============================================
// SOP Schemas
// ============================================

export const sopDifficultySchema = createZodEnum(['easy', 'medium', 'hard'])

export const sopStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(), // in minutes
  tips: z.string().optional(),
  media_url: z.string().url().optional().nullable(),
})

export const createSopSchema = z.object({
  title: z.string().min(2, 'Judul SOP minimal 2 karakter').max(200),
  description: z.string().optional(),
  category: z.string().min(1, 'Kategori harus diisi'),
  content: z.record(z.string(), z.any()).optional(),
  steps: z.array(sopStepSchema).optional(),
  attachments: z.array(z.string().url()).optional(),
  estimated_time: z.number().int().positive().optional(), // in minutes
  difficulty: sopDifficultySchema.optional(),
})

export const updateSopSchema = createSopSchema.partial().extend({
  id: z.string().uuid(),
})

export const sopFilterSchema = z.object({
  category: z.string().optional(),
  difficulty: sopDifficultySchema.array().optional(),
  search: z.string().optional(),
  created_by: z.string().uuid().optional(),
})

// ============================================
// Client Update Schemas
// ============================================

export const clientUpdateTypeSchema = createZodEnum(['email', 'whatsapp', 'meeting', 'call'])

export const createClientUpdateSchema = z.object({
  campaign_id: z.string().uuid('ID campaign tidak valid'),
  type: clientUpdateTypeSchema,
  subject: z.string().optional(),
  content: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  sent_at: z.string().datetime().optional(),
})

export const updateClientUpdateSchema = createClientUpdateSchema.partial().extend({
  id: z.string().uuid(),
})

// ============================================
// Activity Log Schemas
// ============================================

export const activityFilterSchema = z.object({
  user_id: z.string().uuid().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().uuid().optional(),
  action: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
})

// ============================================
// File Upload Schemas
// ============================================

export const fileUploadSchema = z.object({
  file_name: z.string().min(1),
  file_type: z.string(),
  file_size: z.number().positive(),
  bucket: z.string().optional(),
  folder: z.string().optional(),
})

// ============================================
// Notification Schemas
// ============================================

export const notificationPreferencesSchema = z.object({
  email: z.boolean().optional(),
  push: z.boolean().optional(),
  sms: z.boolean().optional(),
  types: z.array(z.enum([
    'task_assigned',
    'task_due',
    'campaign_status_change',
    'invoice_overdue',
    'invoice_paid',
    'client_update',
    'mention',
    'system',
  ])).optional(),
})

// ============================================
// Type Exports
// ============================================

export type PaginationInput = z.infer<typeof paginationSchema>
export type SortInput = z.infer<typeof sortSchema>
export type SearchInput = z.infer<typeof searchSchema>

export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>

export type CreateClient = z.infer<typeof createClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>

export type CreateCampaign = z.infer<typeof createCampaignSchema>
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>
export type CampaignFilter = z.infer<typeof campaignFilterSchema>

export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTask = z.infer<typeof updateTaskSchema>
export type TaskFilter = z.infer<typeof taskFilterSchema>

export type CreateChecklist = z.infer<typeof createChecklistSchema>
export type UpdateChecklist = z.infer<typeof updateChecklistSchema>

export type CreatePublisher = z.infer<typeof createPublisherSchema>
export type UpdatePublisher = z.infer<typeof updatePublisherSchema>
export type PublisherFilter = z.infer<typeof publisherFilterSchema>

export type CreatePerformanceEntry = z.infer<typeof createPerformanceEntrySchema>
export type UpdatePerformanceEntry = z.infer<typeof updatePerformanceEntrySchema>

export type CreateInvoice = z.infer<typeof createInvoiceSchema>
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>
export type InvoiceFilter = z.infer<typeof invoiceFilterSchema>

export type CreateSop = z.infer<typeof createSopSchema>
export type UpdateSop = z.infer<typeof updateSopSchema>

export type CreateClientUpdate = z.infer<typeof createClientUpdateSchema>
export type UpdateClientUpdate = z.infer<typeof updateClientUpdateSchema>
