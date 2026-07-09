/**
 * Rectoverso OS - Publisher Hooks
 * React Query hooks for publisher operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import type { Publisher, CreatePublisher, UpdatePublisher } from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchPublishers(): Promise<Publisher[]> {
  const res = await fetch(`${API_BASE}/publishers`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch publishers')
  const data = await res.json()
  return data.data || []
}

async function fetchPublisher(id: string): Promise<Publisher> {
  const res = await fetch(`${API_BASE}/publishers/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch publisher')
  const data = await res.json()
  return data.data
}

async function createPublisher(publisher: CreatePublisher): Promise<Publisher> {
  const res = await fetch(`${API_BASE}/publishers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(publisher),
  })
  if (!res.ok) throw new Error('Failed to create publisher')
  const data = await res.json()
  return data.data
}

async function updatePublisher(id: string, publisher: Partial<UpdatePublisher>): Promise<Publisher> {
  const res = await fetch(`${API_BASE}/publishers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(publisher),
  })
  if (!res.ok) throw new Error('Failed to update publisher')
  const data = await res.json()
  return data.data
}

// ============================================
// Query Hooks
// ============================================

export function usePublishers() {
  return useQuery({
    queryKey: queryKeys.publishers?.list(),
    queryFn: fetchPublishers,
  })
}

export function usePublisher(id: string) {
  return useQuery({
    queryKey: queryKeys.publishers?.detail(id),
    queryFn: () => fetchPublisher(id),
    enabled: !!id,
  })
}

export function useCreatePublisher(options?: {
  onSuccess?: (data: Publisher) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPublisher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publishers?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export function useUpdatePublisher(options?: {
  onSuccess?: (data: Publisher) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdatePublisher> }) =>
      updatePublisher(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publishers?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
