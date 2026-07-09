/**
 * Rectoverso OS - Task Hooks
 * React Query hooks for task operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { queryKeys } from '../client'
import type {
  Task,
  CreateTask,
  UpdateTask,
  TaskStatus,
  TaskPriority,
  TaskFilter,
  PaginatedResponse,
} from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchTasks(
  filters?: TaskFilter & { page?: number; pageSize?: number }
): Promise<PaginatedResponse<Task>> {
  const params = new URLSearchParams()

  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.pageSize) params.set('pageSize', String(filters.pageSize))
  if (filters?.status?.length) filters.status.forEach(s => params.append('status', s))
  if (filters?.priority?.length) filters.priority.forEach(p => params.append('priority', p))
  if (filters?.campaign_id) params.set('campaign_id', filters.campaign_id)
  if (filters?.owner_id) params.set('owner_id', filters.owner_id)
  if (filters?.overdue) params.set('overdue', 'true')

  const res = await fetch(`${API_BASE}/tasks?${params.toString()}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  return res.json()
}

async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function createTask(task: CreateTask): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(task),
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function updateTask(id: string, task: Partial<UpdateTask>): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(task),
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  const data = await res.json()
  return data.data
}

async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json()
    throw error
  }
}

// ============================================
// Query Hooks
// ============================================

/**
 * Get paginated tasks list
 */
export function useTasks(
  filters?: TaskFilter & { page?: number; pageSize?: number },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => fetchTasks(filters),
    enabled: options?.enabled !== false,
  })
}

/**
 * Get single task detail
 */
export function useTask(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => fetchTask(id),
    enabled: options?.enabled !== false && !!id,
  })
}

/**
 * Get tasks grouped by status (for Kanban)
 */
export function useKanbanTasks(campaignId?: string) {
  return useQuery({
    queryKey: queryKeys.tasks.kanban(),
    queryFn: async () => {
      const [todo, inProgress, review, done, blocked] = await Promise.all([
        fetchTasks({ status: ['todo'], campaign_id: campaignId, pageSize: 100 }),
        fetchTasks({ status: ['in_progress'], campaign_id: campaignId, pageSize: 100 }),
        fetchTasks({ status: ['review'], campaign_id: campaignId, pageSize: 100 }),
        fetchTasks({ status: ['done'], campaign_id: campaignId, pageSize: 100 }),
        fetchTasks({ status: ['blocked'], campaign_id: campaignId, pageSize: 100 }),
      ])

      return {
        todo: todo.data?.items ?? [],
        in_progress: inProgress.data?.items ?? [],
        review: review.data?.items ?? [],
        done: done.data?.items ?? [],
        blocked: blocked.data?.items ?? [],
      }
    },
    enabled: true,
  })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Create new task
 */
export function useCreateTask(options?: {
  onSuccess?: (data: Task) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

/**
 * Update task
 */
export function useUpdateTask(options?: {
  onSuccess?: (data: Task) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateTask> }) =>
      updateTask(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.tasks.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

/**
 * Update task status (optimistic)
 */
export function useUpdateTaskStatus(options?: {
  onSuccess?: (data: Task) => void
  onError?: (error: Error, variables: { id: string; status: TaskStatus }, context: unknown) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.kanban())

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: queryKeys.tasks.all },
        (old: any) => {
          if (!old?.data?.items) return old
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((task: Task) =>
                task.id === id ? { ...task, status } : task
              ),
            },
          }
        }
      )

      return { previousTasks }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.kanban(), context.previousTasks)
      }
      options?.onError?.(error as Error, variables, context)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
    onSuccess: options?.onSuccess,
  })
}

/**
 * Delete task
 */
export function useDeleteTask(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}

// ============================================
// Bulk Operations
// ============================================

/**
 * Bulk update task status
 */
export function useBulkUpdateTaskStatus(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: { id: string; status: TaskStatus }[]) => {
      await Promise.all(
        updates.map(({ id, status }) => updateTaskStatus(id, status))
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}
