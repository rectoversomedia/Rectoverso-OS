/**
 * Rectoverso OS - Empty State Components
 * Empty state displays for various scenarios
 */

'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Search, FolderOpen, FileText, Users, Calendar, DollarSign, Inbox } from 'lucide-react'

// ============================================
// Types
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

// ============================================
// Base Empty State
// ============================================

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Pre-built Empty States
// ============================================

export function NoData({
  title = 'Belum Ada Data',
  description = 'Data akan muncul di sini setelah ditambahkan.',
  ...props
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={<Inbox className="h-12 w-12" />}
      title={title}
      description={description}
      {...props}
    />
  )
}

export function NoSearchResults({
  query,
  onClear,
  ...props
}: {
  query?: string
  onClear?: () => void
} & Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="Tidak Ditemukan"
      description={query ? `"${query}" tidak ditemukan. Coba kata kunci lain.` : 'Tidak ada hasil yang cocok.'}
      action={onClear ? { label: 'Clear Search', onClick: onClear } : undefined}
      {...props}
    />
  )
}

export function NoCampaigns({
  onCreateNew,
  ...props
}: {
  onCreateNew?: () => void
}) {
  return (
    <EmptyState
      icon={<FolderOpen className="h-12 w-12" />}
      title="Belum Ada Campaign"
      description="Mulai campaign pertamamu untuk melacak performa dan mengelola workflow."
      action={onCreateNew ? { label: 'Buat Campaign Baru', onClick: onCreateNew } : undefined}
      {...props}
    />
  )
}

export function NoTasks({
  onCreateNew,
  ...props
}: {
  onCreateNew?: () => void
}) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="Belum Ada Task"
      description="Task membantu kamu melacak progress danassign pekerjaan ke tim."
      action={onCreateNew ? { label: 'Buat Task Baru', onClick: onCreateNew } : undefined}
      {...props}
    />
  )
}

export function NoClients({
  onAddNew,
  ...props
}: {
  onAddNew?: () => void
}) {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12" />}
      title="Belum Ada Client"
      description="Tambahkan client untuk mulai mengelola campaign dan invoice."
      action={onAddNew ? { label: 'Tambah Client Baru', onClick: onAddNew } : undefined}
      {...props}
    />
  )
}

export function NoInvoices({
  onCreateNew,
  ...props
}: {
  onCreateNew?: () => void
}) {
  return (
    <EmptyState
      icon={<DollarSign className="h-12 w-12" />}
      title="Belum Ada Invoice"
      description="Invoice akan muncul di sini setelah campaign selesai."
      action={onCreateNew ? { label: 'Buat Invoice Baru', onClick: onCreateNew } : undefined}
      {...props}
    />
  )
}

export function NoCalendarEvents({
  onAddNew,
  ...props
}: {
  onAddNew?: () => void
}) {
  return (
    <EmptyState
      icon={<Calendar className="h-12 w-12" />}
      title="Tidak Ada Acara"
      description="Tidak ada deadline atau acara terjadwal untuk periode ini."
      action={onAddNew ? { label: 'Tambah Acara', onClick: onAddNew } : undefined}
      {...props}
    />
  )
}

// ============================================
// Section Empty State
// ============================================

interface SectionEmptyProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function SectionEmpty({
  title,
  description,
  icon,
  action,
}: SectionEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon && (
        <div className="mb-3 text-muted-foreground">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-medium text-foreground mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-muted-foreground mb-3 max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
