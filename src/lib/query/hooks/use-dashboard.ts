/**
 * Rectoverso OS - Dashboard Hooks
 * React Query hooks for dashboard data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'

// ============================================
// Types
// ============================================

export interface DashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  problemCampaigns: number
  totalTasks: number
  pendingTasks: number
  overdueTasks: number
  totalClients: number
  activeClients: number
  totalRevenue: number
  outstandingPayments: number
  overduePayments: number
  totalLeads: number
  totalInvoices: number
}

export interface CampaignHealth {
  campaignId: string
  campaignName: string
  clientName: string
  status: string
  health: 'green' | 'yellow' | 'red'
  picName: string
  updatedAt: string
}

export interface UpcomingTask {
  id: string
  title: string
  campaignName?: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: string
  ownerName?: string
}

export interface RecentActivity {
  id: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  userName: string
  userAvatar?: string
  createdAt: string
}

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard/stats`, { credentials: 'include' })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function fetchCampaignHealth(): Promise<CampaignHealth[]> {
  const res = await fetch(`${API_BASE}/dashboard/campaign-health`, { credentials: 'include' })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function fetchUpcomingTasks(): Promise<UpcomingTask[]> {
  const res = await fetch(`${API_BASE}/dashboard/upcoming-tasks`, { credentials: 'include' })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function fetchRecentActivity(): Promise<RecentActivity[]> {
  const res = await fetch(`${API_BASE}/dashboard/recent-activity`, { credentials: 'include' })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

// ============================================
// Query Hooks
// ============================================

export function useDashboardStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000, // 1 minute
    enabled: options?.enabled !== false,
  })
}

export function useCampaignHealth(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: fetchCampaignHealth,
    staleTime: 60 * 1000,
    enabled: options?.enabled !== false,
  })
}

export function useUpcomingTasks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard.upcomingTasks(),
    queryFn: fetchUpcomingTasks,
    staleTime: 60 * 1000,
    enabled: options?.enabled !== false,
  })
}

export function useRecentActivity(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(),
    queryFn: fetchRecentActivity,
    staleTime: 30 * 1000, // 30 seconds
    enabled: options?.enabled !== false,
  })
}

// ============================================
// Combined Dashboard Hook
// ============================================

export function useDashboard() {
  const stats = useDashboardStats()
  const health = useCampaignHealth()
  const upcomingTasks = useUpcomingTasks()
  const recentActivity = useRecentActivity()

  const isLoading = stats.isPending || health.isPending || upcomingTasks.isPending || recentActivity.isPending
  const isError = stats.isError || health.isError || upcomingTasks.isError || recentActivity.isError

  return {
    stats: stats.data,
    campaignHealth: health.data,
    upcomingTasks: upcomingTasks.data,
    recentActivity: recentActivity.data,
    isLoading,
    isError,
    error: stats.error || health.error || upcomingTasks.error || recentActivity.error,
    refetch: async () => {
      await Promise.all([
        stats.refetch(),
        health.refetch(),
        upcomingTasks.refetch(),
        recentActivity.refetch(),
      ])
    },
  }
}
