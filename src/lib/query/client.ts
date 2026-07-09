/**
 * Rectoverso OS - Query Client Provider
 * React Query client configuration with caching and retry logic
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

// ============================================
// Query Client Configuration
// ============================================

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time - how long data is considered fresh
        staleTime: 60 * 1000, // 1 minute
        // Cache time - how long unused data stays in cache
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Retry configuration
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          // Retry up to 3 times
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => {
          // Exponential backoff: 1s, 2s, 4s
          return Math.min(1000 * 2 ** attemptIndex, 30000)
        },
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        retryDelay: 1000,
      },
    },
  })
}

// ============================================
// Provider Component
// ============================================

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

// ============================================
// Query Keys Factory
// ============================================

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  // Clients
  clients: {
    all: ['clients'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.clients.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.clients.all, 'detail', id] as const,
  },

  // Campaigns
  campaigns: {
    all: ['campaigns'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.campaigns.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.campaigns.all, 'detail', id] as const,
    checklists: (id: string) => [...queryKeys.campaigns.all, 'checklists', id] as const,
    publishers: (id: string) => [...queryKeys.campaigns.all, 'publishers', id] as const,
    performance: (id: string) => [...queryKeys.campaigns.all, 'performance', id] as const,
  },

  // Tasks
  tasks: {
    all: ['tasks'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.tasks.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
    kanban: () => [...queryKeys.tasks.all, 'kanban'] as const,
  },

  // Checklists
  checklists: {
    all: ['checklists'] as const,
    byCampaign: (campaignId: string) => [...queryKeys.checklists.all, 'campaign', campaignId] as const,
    detail: (id: string) => [...queryKeys.checklists.all, 'detail', id] as const,
  },

  // Publishers
  publishers: {
    all: ['publishers'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.publishers.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.publishers.all, 'detail', id] as const,
  },

  // Finance
  invoices: {
    all: ['invoices'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.invoices.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.invoices.all, 'detail', id] as const,
    overdue: () => [...queryKeys.invoices.all, 'overdue'] as const,
  },

  // SOPs
  sops: {
    all: ['sops'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.sops.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.sops.all, 'detail', id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    recentActivity: () => [...queryKeys.dashboard.all, 'recentActivity'] as const,
    upcomingTasks: () => [...queryKeys.dashboard.all, 'upcomingTasks'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
  },

  // Calendar
  calendar: {
    all: ['calendar'] as const,
    events: (range?: { start: string; end: string }) => [...queryKeys.calendar.all, 'events', range] as const,
  },
}

// ============================================
// Query Hooks Exports
// ============================================

export * from './hooks/use-campaigns'
export * from './hooks/use-tasks'
export * from './hooks/use-clients'
export * from './hooks/use-invoices'
export * from './hooks/use-publishers'
export * from './hooks/use-sops'
export * from './hooks/use-dashboard'
export * from './hooks/use-users'
