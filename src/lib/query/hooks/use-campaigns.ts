/**
 * Rectoverso OS - Campaign Hooks
 * React Query hooks for campaign operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { queryKeys } from '../client'
import type {
  Campaign,
  CampaignChecklist,
  CreateCampaign,
  UpdateCampaign,
  CampaignFilter,
  PaginatedResponse,
} from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchCampaigns(
  filters?: CampaignFilter & { page?: number; pageSize?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<PaginatedResponse<Campaign>> {
  const params = new URLSearchParams()

  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))
  if (filters?.sortBy) params.set('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder)
  if (filters?.status?.length) filters.status.forEach(s => params.append('status', s))
  if (filters?.health?.length) filters.health.forEach(h => params.append('health', h))
  if (filters?.type?.length) filters.type.forEach(t => params.append('type', t))
  if (filters?.client_id?.length) filters.client_id.forEach(c => params.append('client_id', c))
  if (filters?.pic_id?.length) filters.pic_id.forEach(p => params.append('pic_id', p))
  if (filters?.search) params.set('search', filters.search)

  const res = await fetch(`${API_BASE}/campaigns?${params.toString()}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json() as PaginatedResponse<Campaign>
  return data
}

async function fetchCampaign(id: string): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function createCampaign(campaign: CreateCampaign): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(campaign),
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function updateCampaign(id: string, campaign: Partial<UpdateCampaign>): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(campaign),
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function deleteCampaign(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }
}

async function fetchCampaignChecklists(campaignId: string): Promise<CampaignChecklist[]> {
  const res = await fetch(`${API_BASE}/campaigns/${campaignId}/checklists`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

// ============================================
// Query Hooks
// ============================================

/**
 * Get paginated campaigns list
 */
export function useCampaigns(
  filters?: CampaignFilter & { page?: number; pageSize?: number },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters as Record<string, unknown>),
    queryFn: () => fetchCampaigns(filters),
    enabled: options?.enabled !== false,
  })
}

/**
 * Get single campaign detail
 */
export function useCampaign(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => fetchCampaign(id),
    enabled: options?.enabled !== false && !!id,
  })
}

/**
 * Get campaign checklists
 */
export function useCampaignChecklists(campaignId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.campaigns.checklists(campaignId),
    queryFn: () => fetchCampaignChecklists(campaignId),
    enabled: options?.enabled !== false && !!campaignId,
  })
}

/**
 * Get infinite campaigns (for load more)
 */
export function useInfiniteCampaigns(filters?: CampaignFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.campaigns.list({ ...filters, useInfinite: true }),
    queryFn: async ({ pageParam }: { pageParam: number }): Promise<PaginatedResponse<Campaign>> => {
      return fetchCampaigns({ ...filters, page: pageParam })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage as PaginatedResponse<Campaign>
      if (page.pagination?.hasNextPage) {
        return (page.pagination.page ?? 0) + 1
      }
      return undefined
    },
  })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Create new campaign
 */
export function useCreateCampaign(options?: {
  onSuccess?: (data: Campaign) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: (data) => {
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

/**
 * Update campaign
 */
export function useUpdateCampaign(options?: {
  onSuccess?: (data: Campaign) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateCampaign> }) =>
      updateCampaign(id, data),
    onSuccess: (data) => {
      // Update campaign detail cache
      queryClient.setQueryData(queryKeys.campaigns.detail(data.id), data)
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

/**
 * Delete campaign
 */
export function useDeleteCampaign(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      // Invalidate campaigns list
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all })
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}

// ============================================
// Optimistic Update Helper
// ============================================

export function useOptimisticUpdate<T>(
  queryKey: readonly unknown[]
) {
  const queryClient = useQueryClient()

  return {
    /**
     * Optimistically update a single item
     */
    optimisticUpdate: (
      id: string,
      update: Partial<T>,
      Updater: (old: T, update: Partial<T>) => T
    ) => {
      queryClient.setQueryData<T[]>(queryKey, (old) => {
        if (!old) return old
        return old.map((item) =>
          (item as { id: string }).id === id ? Updater(item, update) : item
        )
      })
    },

    /**
     * Cancel any outgoing refetches
     */
    cancel: () => {
      queryClient.cancelQueries({ queryKey })
    },

    /**
     * Rollback optimistic update
     */
    rollback: (previousData: T[]) => {
      queryClient.setQueryData(queryKey, previousData)
    },
  }
}

// ============================================
// Pre-fetch Helper
// ============================================

export function usePrefetchCampaign() {
  const queryClient = useQueryClient()

  return {
    prefetchCampaign: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.campaigns.detail(id),
        queryFn: () => fetchCampaign(id),
      })
    },
  }
}
