/**
 * Rectoverso OS - Error Boundary
 * Global error handling component
 */

'use client'

import React, { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

// ============================================
// Error Fallback Props
// ============================================

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// ============================================
// Error Fallback Component
// ============================================

function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button
        onClick={resetErrorBoundary}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 p-4 bg-slate-100 rounded-lg text-xs text-slate-600 overflow-auto max-w-2xl">
          {error.stack}
        </pre>
      )}
    </div>
  )
}

// ============================================
// Error Boundary Component
// ============================================

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const fallbackProps: ErrorFallbackProps = {
        error: this.state.error,
        resetErrorBoundary: this.resetError,
      }

      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(fallbackProps)
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      return <DefaultErrorFallback {...fallbackProps} />
    }

    return this.props.children
  }
}

// ============================================
// Global Error Page
// ============================================

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
          <div className="rounded-full bg-red-100 p-4 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Application Error
          </h1>
          <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
            {error.message || 'An unexpected error occurred. Please refresh the page.'}
          </p>
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          {process.env.NODE_ENV === 'development' && error.digest && (
            <p className="mt-4 text-xs text-slate-400">
              Error digest: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}

// ============================================
// Hook for Error Boundary Reset
// ============================================

export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const throwError = React.useCallback((err: Error) => {
    setError(err)
    throw err
  }, [])

  if (error) {
    throw error
  }

  return { throwError, resetError }
}
