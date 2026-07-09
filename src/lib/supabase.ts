import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          role?: string
          avatar_url?: string | null
        }
        Update: {
          full_name?: string
          email?: string
          role?: string
          avatar_url?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          industry: string | null
          pic_name: string | null
          pic_email: string | null
          pic_whatsapp: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          pic_name?: string | null
          pic_email?: string | null
          pic_whatsapp?: string | null
          notes?: string | null
        }
        Update: {
          name?: string
          industry?: string | null
          pic_name?: string | null
          pic_email?: string | null
          pic_whatsapp?: string | null
          notes?: string | null
        }
      }
      campaigns: {
        Row: {
          id: string
          client_id: string | null
          name: string
          type: string
          objective: string | null
          status: string
          health_status: string
          start_date: string | null
          end_date: string | null
          budget: number
          kpi_type: string | null
          kpi_target: number
          kpi_current: number
          tracking_link: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          pic_id: string | null
          payment_status: string
          notes: string | null
          deliverables: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          name: string
          type: string
          objective?: string | null
          status?: string
          health_status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number
          kpi_type?: string | null
          kpi_target?: number
          kpi_current?: number
          tracking_link?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          pic_id?: string | null
          payment_status?: string
          notes?: string | null
          deliverables?: Json
        }
        Update: {
          client_id?: string | null
          name?: string
          type?: string
          objective?: string | null
          status?: string
          health_status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number
          kpi_type?: string | null
          kpi_target?: number
          kpi_current?: number
          tracking_link?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          pic_id?: string | null
          payment_status?: string
          notes?: string | null
          deliverables?: Json
        }
      }
      tasks: {
        Row: {
          id: string
          campaign_id: string | null
          title: string
          description: string | null
          status: string
          priority: string
          owner_id: string | null
          due_date: string | null
          sop_id: string | null
          comment_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          title: string
          description?: string | null
          status?: string
          priority?: string
          owner_id?: string | null
          due_date?: string | null
          sop_id?: string | null
          comment_count?: number | null
        }
        Update: {
          campaign_id?: string | null
          title?: string
          description?: string | null
          status?: string
          priority?: string
          owner_id?: string | null
          due_date?: string | null
          sop_id?: string | null
          comment_count?: number | null
        }
      }
      publishers: {
        Row: {
          id: string
          name: string
          type: string
          category: string | null
          city: string | null
          province: string | null
          contact_person: string | null
          whatsapp: string | null
          email: string | null
          rate: number | null
          audience_size: number | null
          quality_score: number | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          category?: string | null
          city?: string | null
          province?: string | null
          contact_person?: string | null
          whatsapp?: string | null
          email?: string | null
          rate?: number | null
          audience_size?: number | null
          quality_score?: number | null
          status?: string
          notes?: string | null
        }
        Update: {
          name?: string
          type?: string
          category?: string | null
          city?: string | null
          province?: string | null
          contact_person?: string | null
          whatsapp?: string | null
          email?: string | null
          rate?: number | null
          audience_size?: number | null
          quality_score?: number | null
          status?: string
          notes?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string | null
          campaign_id: string | null
          invoice_number: string
          amount: number
          invoice_date: string | null
          due_date: string | null
          status: string
          paid_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          campaign_id?: string | null
          invoice_number: string
          amount: number
          invoice_date?: string | null
          due_date?: string | null
          status?: string
          paid_date?: string | null
          notes?: string | null
        }
        Update: {
          client_id?: string | null
          campaign_id?: string | null
          invoice_number?: string
          amount?: number
          invoice_date?: string | null
          due_date?: string | null
          status?: string
          paid_date?: string | null
          notes?: string | null
        }
      }
      sops: {
        Row: {
          id: string
          title: string
          category: string
          role: string
          estimated_time: string | null
          content: string | null
          checklist: Json
          video_url: string | null
          templates: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          role: string
          estimated_time?: string | null
          content?: string | null
          checklist?: Json
          video_url?: string | null
          templates?: Json
        }
        Update: {
          title?: string
          category?: string
          role?: string
          estimated_time?: string | null
          content?: string | null
          checklist?: Json
          video_url?: string | null
          templates?: Json
        }
      }
    }
  }
}
