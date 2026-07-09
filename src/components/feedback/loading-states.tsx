/**
 * Rectoverso OS - Loading States
 * Loading skeleton and spinner components
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// Spinner Component
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-cyan-600', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// ============================================
// Loading Overlay
// ============================================

interface LoadingOverlayProps {
  fullScreen?: boolean
  text?: string
  className?: string
}

export function LoadingOverlay({ fullScreen = false, text, className }: LoadingOverlayProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={cn(containerClass, className)}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {text && (
          <p className="text-sm text-slate-500 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

// ============================================
// Skeleton Components
// ============================================

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200',
        className
      )}
    />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-slate-200 p-4', className)}>
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonKanban({ columns = 5, cardsPerColumn = 3 }: { columns?: number; cardsPerColumn?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(250px, 1fr))` }}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div key={cardIndex} className="rounded-lg border border-slate-200 p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Page Loading State
// ============================================

interface PageLoadingProps {
  title?: string
  subtitle?: string
}

export function PageLoading({ title = 'Loading...', subtitle }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-slate-500">{title}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}

// ============================================
// Data Table Loading
// ============================================

export function DataTableLoading({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) {
  return <SkeletonTable rows={rows} cols={columns} />
}

// ============================================
// Dashboard Stats Loading
// ============================================

export function DashboardStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Content Area Loading
// ============================================

interface ContentLoadingProps {
  showSidebar?: boolean
}

export function ContentLoading({ showSidebar = false }: ContentLoadingProps) {
  return (
    <div className={cn('space-y-6', showSidebar && 'lg:col-span-2')}>
      <DashboardStatsLoading />
      <SkeletonCard className="h-48" />
      <DataTableLoading />
    </div>
  )
}
