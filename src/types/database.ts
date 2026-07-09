/**
 * Rectoverso OS - Database Types
 * Generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// ENUMS
// ============================================

export type UserRole =
  | 'founder'
  | 'admin'
  | 'campaign_manager'
  | 'campaign_ops'
  | 'finance'
  | 'sales'
  | 'intern'

export type CampaignStatus =
  | 'draft'
  | 'waiting_brief'
  | 'setup'
  | 'running'
  | 'reporting'
  | 'completed'
  | 'paused'
  | 'problem'

export type HealthStatus = 'green' | 'yellow' | 'red'

export type CampaignType =
  | 'lead_generation'
  | 'app_download'
  | 'registration'
  | 'vcbl'
  | 'influencer_campaign'
  | 'publisher_distribution'
  | 'media_placement'
  | 'performance_campaign'
  | 'social_amplification'

export type PaymentStatus =
  | 'not_invoiced'
  | 'invoice_sent'
  | 'waiting_payment'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'disputed'

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type PublisherType =
  | 'media'
  | 'influencer'
  | 'community'
  | 'local_contributor'
  | 'website'
  | 'social_account'
  | 'whatsapp_group'
  | 'telegram_group'

export type PublisherStatus = 'active' | 'inactive' | 'testing' | 'blacklist'

export type ChecklistPhase =
  | 'preparation'
  | 'setup'
  | 'execution'
  | 'monitoring'
  | 'reporting'
  | 'finance'

export type ChecklistStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

// ============================================
// DATABASE TABLES
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: UserRole
          avatar_url: string | null
          phone: string | null
          department: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          department?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      clients: {
        Row: {
          id: string
          name: string
          industry: string | null
          contact_person: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          website: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      campaigns: {
        Row: {
          id: string
          client_id: string
          name: string
          type: CampaignType
          status: CampaignStatus
          health: HealthStatus
          description: string | null
          brief_url: string | null
          objective: string | null
          kpi: Json | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          pic_id: string | null
          tracking_link: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          type: CampaignType
          status?: CampaignStatus
          health?: HealthStatus
          description?: string | null
          brief_url?: string | null
          objective?: string | null
          kpi?: Json | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          pic_id?: string | null
          tracking_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          type?: CampaignType
          status?: CampaignStatus
          health?: HealthStatus
          description?: string | null
          brief_url?: string | null
          objective?: string | null
          kpi?: Json | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          pic_id?: string | null
          tracking_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      tasks: {
        Row: {
          id: string
          campaign_id: string | null
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          owner_id: string | null
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          sop_id: string | null
          parent_task_id: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          owner_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          sop_id?: string | null
          parent_task_id?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          owner_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          sop_id?: string | null
          parent_task_id?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }

      campaign_checklists: {
        Row: {
          id: string
          campaign_id: string
          title: string
          phase: ChecklistPhase
          status: ChecklistStatus
          order: number
          owner_id: string | null
          due_date: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          phase: ChecklistPhase
          status?: ChecklistStatus
          order?: number
          owner_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          phase?: ChecklistPhase
          status?: ChecklistStatus
          order?: number
          owner_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      publishers: {
        Row: {
          id: string
          name: string
          type: PublisherType
          status: PublisherStatus
          platform: string | null
          handle: string | null
          url: string | null
          reach: number | null
          engagement_rate: number | null
          quality_score: number | null
          contact_person: string | null
          contact_email: string | null
          contact_phone: string | null
          rate_card: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: PublisherType
          status?: PublisherStatus
          platform?: string | null
          handle?: string | null
          url?: string | null
          reach?: number | null
          engagement_rate?: number | null
          quality_score?: number | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          rate_card?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: PublisherType
          status?: PublisherStatus
          platform?: string | null
          handle?: string | null
          url?: string | null
          reach?: number | null
          engagement_rate?: number | null
          quality_score?: number | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          rate_card?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      campaign_publishers: {
        Row: {
          id: string
          campaign_id: string
          publisher_id: string
          budget: number | null
          allocated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          publisher_id: string
          budget?: number | null
          allocated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          publisher_id?: string
          budget?: number | null
          allocated?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      performance_entries: {
        Row: {
          id: string
          campaign_id: string
          date: string
          impressions: number | null
          clicks: number | null
          ctr: number | null
          leads: number | null
          conversions: number | null
          spend: number | null
          cpl: number | null
          cpc: number | null
          roi: number | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          date: string
          impressions?: number | null
          clicks?: number | null
          ctr?: number | null
          leads?: number | null
          conversions?: number | null
          spend?: number | null
          cpl?: number | null
          cpc?: number | null
          roi?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          date?: string
          impressions?: number | null
          clicks?: number | null
          ctr?: number | null
          leads?: number | null
          conversions?: number | null
          spend?: number | null
          cpl?: number | null
          cpc?: number | null
          roi?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }

      invoices: {
        Row: {
          id: string
          client_id: string
          campaign_id: string | null
          invoice_number: string
          amount: number
          tax: number | null
          total: number
          status: PaymentStatus
          issue_date: string
          due_date: string
          paid_date: string | null
          paid_amount: number | null
          notes: string | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          campaign_id?: string | null
          invoice_number: string
          amount: number
          tax?: number | null
          total?: number
          status?: PaymentStatus
          issue_date: string
          due_date: string
          paid_date?: string | null
          paid_amount?: number | null
          notes?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          campaign_id?: string | null
          invoice_number?: string
          amount?: number
          tax?: number | null
          total?: number
          status?: PaymentStatus
          issue_date?: string
          due_date?: string
          paid_date?: string | null
          paid_amount?: number | null
          notes?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      sops: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          content: Json | null
          steps: Json | null
          attachments: string[] | null
          estimated_time: number | null
          difficulty: 'easy' | 'medium' | 'hard'
          version: number
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          content?: Json | null
          steps?: Json | null
          attachments?: string[] | null
          estimated_time?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          version?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          content?: Json | null
          steps?: Json | null
          attachments?: string[] | null
          estimated_time?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          version?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      client_updates: {
        Row: {
          id: string
          campaign_id: string
          sent_by: string
          type: 'email' | 'whatsapp' | 'meeting' | 'call'
          subject: string | null
          content: string | null
          attachments: string[] | null
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          sent_by: string
          type: 'email' | 'whatsapp' | 'meeting' | 'call'
          subject?: string | null
          content?: string | null
          attachments?: string[] | null
          sent_at: string
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          sent_by?: string
          type?: 'email' | 'whatsapp' | 'meeting' | 'call'
          subject?: string | null
          content?: string | null
          attachments?: string[] | null
          sent_at?: string
          created_at?: string
        }
      }

      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}

// ============================================
// RELATIONSHIP TYPES
// ============================================

export type User = Database['public']['Tables']['users']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type CampaignChecklist = Database['public']['Tables']['campaign_checklists']['Row']
export type Publisher = Database['public']['Tables']['publishers']['Row']
export type CampaignPublisher = Database['public']['Tables']['campaign_publishers']['Row']
export type PerformanceEntry = Database['public']['Tables']['performance_entries']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type Sop = Database['public']['Tables']['sops']['Row']
export type ClientUpdate = Database['public']['Tables']['client_updates']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
