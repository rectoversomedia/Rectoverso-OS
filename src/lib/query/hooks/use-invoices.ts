/**
 * Rectoverso OS - Invoice Hooks
 * React Query hooks for invoice operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../client'
import type { Invoice, CreateInvoice, UpdateInvoice } from '@/types/database'

// ============================================
// API Functions
// ============================================

const API_BASE = '/api'

async function fetchInvoices(): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE}/finance?type=invoices`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch invoices')
  const data = await res.json()
  return data.data || []
}

async function fetchInvoice(id: string): Promise<Invoice> {
  const res = await fetch(`${API_BASE}/finance/invoices/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch invoice')
  const data = await res.json()
  return data.data
}

async function createInvoice(invoice: CreateInvoice): Promise<Invoice> {
  const res = await fetch(`${API_BASE}/finance/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(invoice),
  })
  if (!res.ok) throw new Error('Failed to create invoice')
  const data = await res.json()
  return data.data
}

async function updateInvoice(id: string, invoice: Partial<UpdateInvoice>): Promise<Invoice> {
  const res = await fetch(`${API_BASE}/finance/invoices/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(invoice),
  })
  if (!res.ok) throw new Error('Failed to update invoice')
  const data = await res.json()
  return data.data
}

// ============================================
// Query Hooks
// ============================================

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices?.list(),
    queryFn: fetchInvoices,
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices?.detail(id),
    queryFn: () => fetchInvoice(id),
    enabled: !!id,
  })
}

export function useCreateInvoice(options?: {
  onSuccess?: (data: Invoice) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export function useUpdateInvoice(options?: {
  onSuccess?: (data: Invoice) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateInvoice> }) =>
      updateInvoice(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices?.all || [] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
