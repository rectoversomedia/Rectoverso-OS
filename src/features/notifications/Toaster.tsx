/**
 * Rectoverso OS - Toast Notifications
 * Built on Sonner for beautiful toast notifications
 */

'use client'

import { Toaster as BaseToaster, toast } from 'sonner'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// ============================================
// Toast Configuration
// ============================================

export const TOAST_DURATION = 5000
export const TOAST_POSITION = 'top-right'

// ============================================
// Toaster Component
// ============================================

export function Toaster() {
  return (
    <BaseToaster
      position={TOAST_POSITION as any}
      toastOptions={{
        duration: TOAST_DURATION,
        classNames: {
          toast: 'group-[.toaster]:bg-background group-[.toaster]:border-border group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          title: 'text-foreground font-medium',
          description: 'text-muted-foreground text-sm',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          success: 'border-green-500/50 bg-green-50',
          error: 'border-red-500/50 bg-red-50',
          warning: 'border-amber-500/50 bg-amber-50',
          info: 'border-blue-500/50 bg-blue-50',
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        error: <AlertCircle className="h-5 w-5 text-red-600" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        info: <Info className="h-5 w-5 text-blue-600" />,
      }}
      closeButton
    />
  )
}

// ============================================
// Toast Helper Functions
// ============================================

export const showToast = {
  /**
   * Success toast
   */
  success: (title: string, description?: string) => {
    return toast.success(title, { description })
  },

  /**
   * Error toast
   */
  error: (title: string, description?: string) => {
    return toast.error(title, { description })
  },

  /**
   * Warning toast
   */
  warning: (title: string, description?: string) => {
    return toast.warning(title, { description })
  },

  /**
   * Info toast
   */
  info: (title: string, description?: string) => {
    return toast.info(title, { description })
  },

  /**
   * Promise toast with loading state
   */
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },

  /**
   * Custom toast with action
   */
  action: (
    title: string,
    description: string,
    action: {
      label: string
      onClick: () => void
    }
  ) => {
    return toast(title, {
      description,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    })
  },

  /**
   * Toast with undo action
   */
  undo: (
    title: string,
    onUndo: () => void,
    duration?: number
  ) => {
    return toast(title, {
      duration: duration ?? 10000,
      action: {
        label: 'Undo',
        onClick: onUndo,
      },
    })
  },

  /**
   * Dismiss all toasts
   */
  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id)
    } else {
      toast.dismiss()
    }
  },
}

// ============================================
// Pre-built Toast Messages
// ============================================

export const toastMessages = {
  // Generic
  genericError: () => showToast.error('Terjadi kesalahan', 'Silakan coba lagi.'),
  savedSuccess: () => showToast.success('Berhasil disimpan'),
  deletedSuccess: () => showToast.success('Berhasil dihapus'),
  copiedSuccess: () => showToast.success('Berhasil disalin'),

  // Campaigns
  campaignCreated: () => showToast.success('Campaign dibuat', 'Campaign baru berhasil ditambahkan.'),
  campaignUpdated: () => showToast.success('Campaign diupdate', 'Perubahan berhasil disimpan.'),
  campaignDeleted: () => showToast.success('Campaign dihapus', 'Campaign berhasil dihapus.'),
  campaignStatusChanged: (from: string, to: string) =>
    showToast.success('Status diubah', `Dari ${from} ke ${to}`),

  // Tasks
  taskCreated: () => showToast.success('Task dibuat', 'Task baru berhasil ditambahkan.'),
  taskUpdated: () => showToast.success('Task diupdate', 'Perubahan berhasil disimpan.'),
  taskDeleted: () => showToast.success('Task dihapus', 'Task berhasil dihapus.'),
  taskAssigned: (assignee: string) =>
    showToast.info('Task di-assign', `Task ditugaskan ke ${assignee}.`),

  // Clients
  clientCreated: () => showToast.success('Client ditambahkan'),
  clientUpdated: () => showToast.success('Client diupdate'),
  clientDeleted: () => showToast.success('Client dihapus'),

  // Finance
  invoiceCreated: () => showToast.success('Invoice dibuat'),
  invoiceSent: () => showToast.success('Invoice dikirim', 'Invoice berhasil dikirim ke client.'),
  paymentRecorded: () => showToast.success('Pembayaran tercatat'),

  // Auth
  loginSuccess: () => showToast.success('Login berhasil', 'Selamat datang di Rectoverso OS.'),
  logoutSuccess: () => showToast.info('Logout berhasil', 'Sampai jumpa kembali.'),

  // Session
  sessionExpired: () => showToast.warning('Session expired', 'Silakan login kembali.'),
}
