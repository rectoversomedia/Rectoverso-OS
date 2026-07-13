/**
 * Rectoverso OS - Client Hooks
 * React Query hooks for client operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import type { Client, CreateClient, UpdateClient, PaginatedResponse } from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchClients(
  filters?: { page?: number; pageSize?: number; search?: string }
): Promise<PaginatedResponse<Client>> {
  const params = new URLSearchParams()
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))
  if (filters?.search) params.set('search', filters.search)

  const res = await fetch(`${API_BASE}/clients?${params.toString()}`, {
    credentials: 'include',
  })

  if (!res.ok) throw await res.json()
  return res.json()
}

async function fetchClient(id: string): Promise<Client> {
  const res = await fetch(`${API_BASE}/clients/${id}`, { credentials: 'include' })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function createClient(client: CreateClient): Promise<Client> {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(client),
  })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function updateClient(id: string, client: Partial<UpdateClient>): Promise<Client> {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(client),
  })
  if (!res.ok) throw await res.json()
  return (await res.json()).data
}

async function deleteClient(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw await res.json()
}

// ============================================
// Query Hooks
// ============================================

export function useClients(
  filters?: { page?: number; pageSize?: number; search?: string },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.clients.list(filters),
    queryFn: () => fetchClients(filters),
    enabled: options?.enabled !== false,
  })
}

export function useClient(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => fetchClient(id),
    enabled: options?.enabled !== false && !!id,
  })
}

// ============================================
// Mutation Hooks
// ============================================

export function useCreateClient(options?: { onSuccess?: (data: Client) => void; onError?: (error: Error) => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export function useUpdateClient(options?: { onSuccess?: (data: Client) => void; onError?: (error: Error) => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateClient> }) => updateClient(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.clients.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export function useDeleteClient(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
