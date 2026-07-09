/**
 * Rectoverso OS - User Hooks
 * React Query hooks for user operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import type { User, CreateUser, UpdateUser } from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch users')
  const data = await res.json()
  return data.data || []
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  const data = await res.json()
  return data.data
}

async function updateUser(id: string, user: Partial<UpdateUser>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error('Failed to update user')
  const data = await res.json()
  return data.data
}

// ============================================
// Query Hooks
// ============================================

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users?.list(),
    queryFn: fetchUsers,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users?.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  })
}

export function useUpdateUser(options?: {
  onSuccess?: (data: User) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateUser> }) =>
      updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
