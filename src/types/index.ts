export type UserRole = "founder" | "admin" | "campaign_manager" | "campaign_ops" | "finance" | "sales" | "intern"

export type CampaignStatus =
  | "draft"
  | "waiting_brief"
  | "setup"
  | "running"
  | "reporting"
  | "completed"
  | "paused"
  | "problem"

export type HealthStatus = "green" | "yellow" | "red"

export type CampaignType =
  | "lead_generation"
  | "app_download"
  | "registration"
  | "vcbl"
  | "influencer_campaign"
  | "publisher_distribution"
  | "media_placement"
  | "performance_campaign"
  | "social_amplification"

export type PaymentStatus =
  | "not_invoiced"
  | "invoice_sent"
  | "waiting_payment"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "disputed"

export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "blocked"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export type PublisherType =
  | "media"
  | "influencer"
  | "community"
  | "local_contributor"
  | "website"
  | "social_account"
  | "whatsapp_group"
  | "telegram_group"

export type PublisherStatus = "active" | "inactive" | "testing" | "blacklist"

export type ChecklistPhase = "preparation" | "setup" | "execution" | "monitoring" | "reporting" | "finance"

export type ChecklistStatus = "todo" | "in_progress" | "done" | "blocked"

export interface User {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Client {
  id: string
  name: string
  industry: string
  pic_name: string
  pic_email: string
  pic_whatsapp: string
  notes?: string
  created_at: string
}

export interface Campaign {
  id: string
  client_id: string
  client?: Client
  name: string
  type: CampaignType
  objective: string
  status: CampaignStatus
  health_status: HealthStatus
  start_date: string
  end_date: string
  budget: number
  kpi_type: string
  kpi_target: number
  kpi_current: number
  tracking_link?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  pic_id: string
  pic?: User
  payment_status: PaymentStatus
  notes?: string
  deliverables?: string[]
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  campaign_id?: string
  campaign?: Campaign
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  owner_id: string
  owner?: User
  due_date: string
  sop_id?: string
  sop?: SOP
  created_at: string
  updated_at: string
  comment_count?: number
}

export interface CampaignChecklist {
  id: string
  campaign_id: string
  phase: ChecklistPhase
  title: string
  status: ChecklistStatus
  owner_id: string
  owner?: User
  due_date?: string
  sop_id?: string
  sop?: SOP
  notes?: string
}

export interface Publisher {
  id: string
  name: string
  type: PublisherType
  category: string
  city: string
  province: string
  contact_person: string
  whatsapp: string
  email?: string
  rate?: number
  audience_size?: number
  quality_score?: number
  status: PublisherStatus
  notes?: string
}

export interface CampaignPublisher {
  id: string
  campaign_id: string
  publisher_id: string
  publisher?: Publisher
  deliverable: string
  budget_allocation: number
  status: string
  notes?: string
}

export interface PerformanceEntry {
  id: string
  campaign_id: string
  date: string
  leads?: number
  clicks?: number
  downloads?: number
  registrations?: number
  cost_spent: number
  notes?: string
}

export interface Invoice {
  id: string
  client_id: string
  client?: Client
  campaign_id?: string
  campaign?: Campaign
  invoice_number: string
  amount: number
  invoice_date: string
  due_date: string
  status: PaymentStatus
  paid_date?: string
  notes?: string
}

export interface SOP {
  id: string
  title: string
  category: string
  role: UserRole
  estimated_time: string
  content: string
  checklist: string[]
  video_url?: string
  templates?: string[]
  updated_at: string
}

export interface ClientUpdate {
  id: string
  campaign_id: string
  date: string
  update_type: string
  message: string
  sent_by: string
  sent_by_user?: User
  status: string
  created_at: string
}

export interface ActivityLog {
  id: string
  entity_type: string
  entity_id: string
  action: string
  description: string
  user_id: string
  user?: User
  created_at: string
}

export interface DashboardStats {
  activeCampaigns: number
  atRiskCampaigns: number
  tasksDueToday: number
  overdueInvoices: number
  outstandingPayment: number
  activeClients: number
  activePublishers: number
  leadsThisMonth: number
}
