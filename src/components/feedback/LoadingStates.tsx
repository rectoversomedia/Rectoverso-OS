/**
 * Rectoverso OS - Loading States Components
 * Skeleton loaders, spinners, and loading indicators
 */

'use client'

import { cn } from '@/lib/utils'

// ============================================
// Skeleton Component
// ============================================

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

// ============================================
// Card Skeleton
// ============================================

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4 p-6 bg-card rounded-lg border', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

// ============================================
// Table Skeleton
// ============================================

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="border rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-muted/50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 p-4 border-b last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================
// List Skeleton
// ============================================

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// Dashboard Stats Skeleton
// ============================================

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-card rounded-lg border space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// Chart Skeleton
// ============================================

export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={cn('space-y-4', height)}>
      <div className="flex items-end justify-end gap-2 h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-6" />
        ))}
      </div>
    </div>
  )
}

// ============================================
// Form Skeleton
// ============================================

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// ============================================
// Page Loading
// ============================================

export function PageLoading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  )
}

// ============================================
// Inline Spinner
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )
}

// ============================================
// Loading Button
// ============================================

interface LoadingButtonProps {
  isLoading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  spinnerSize?: 'sm' | 'md'
}

export function LoadingButton({
  isLoading = false,
  children,
  className,
  disabled,
  spinnerSize = 'sm',
  ...props
}: LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        isLoading && 'cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size={spinnerSize} />}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </button>
  )
}
