/**
 * Rectoverso OS - SOP Hooks
 * React Query hooks for SOP operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import type { SOP, CreateSOP, UpdateSOP } from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchSOPs(): Promise<SOP[]> {
  const res = await fetch(`${API_BASE}/sops`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch SOPs')
  const data = await res.json()
  return data.data || []
}

async function fetchSOP(id: string): Promise<SOP> {
  const res = await fetch(`${API_BASE}/sops/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch SOP')
  const data = await res.json()
  return data.data
}

async function createSOP(sop: CreateSOP): Promise<SOP> {
  const res = await fetch(`${API_BASE}/sops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(sop),
  })
  if (!res.ok) throw new Error('Failed to create SOP')
  const data = await res.json()
  return data.data
}

async function updateSOP(id: string, sop: Partial<UpdateSOP>): Promise<SOP> {
  const res = await fetch(`${API_BASE}/sops/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(sop),
  })
  if (!res.ok) throw new Error('Failed to update SOP')
  const data = await res.json()
  return data.data
}

// ============================================
// Query Hooks
// ============================================

export function useSOPs() {
  return useQuery({
    queryKey: queryKeys.sops?.list(),
    queryFn: fetchSOPs,
  })
}

export function useSOP(id: string) {
  return useQuery({
    queryKey: queryKeys.sops?.detail(id),
    queryFn: () => fetchSOP(id),
    enabled: !!id,
  })
}

export function useCreateSOP(options?: {
  onSuccess?: (data: SOP) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSOP,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sops?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export function useUpdateSOP(options?: {
  onSuccess?: (data: SOP) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateSOP> }) =>
      updateSOP(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sops?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
