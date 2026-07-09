/**
 * Rectoverso OS - Error Boundary
 * Global error handling for React components
 */

'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

// ============================================
// Error Boundary Props & State
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showError?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

// ============================================
// Error Boundary Component
// ============================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log to error tracking service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
      console.error('Error captured by boundary:', error, errorInfo)
    }

    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showError}
        />
      )
    }

    return this.props.children
  }
}

// ============================================
// Error Fallback Component
// ============================================

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  onReset: () => void
  showDetails?: boolean
}

function ErrorFallback({ error, errorInfo, onReset, showDetails = false }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground">
            Maaf, sesuatu tidak berjalan sesuai rencana. Silakan coba lagi atau hubungi tim support.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          <Button variant="ghost" asChild>
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </a>
          </Button>
        </div>

        {/* Error Details (Development Only) */}
        {(showDetails || isDevelopment) && error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Bug className="inline-block w-4 h-4 mr-1" />
              Detail Error
            </summary>
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="font-mono text-xs break-all">
                <strong>Error:</strong> {error.message}
              </p>
              {errorInfo?.componentStack && (
                <pre className="mt-2 font-mono text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Support Link */}
        <p className="text-sm text-muted-foreground">
          Jika masalah berlanjut, silakan hubungi{' '}
          <a href="mailto:support@rectoverso.com" className="text-primary hover:underline">
            support@rectoverso.com
          </a>
        </p>
      </div>
    </div>
  )
}

// ============================================
// Async Fallback Component
// ============================================

interface AsyncErrorFallbackProps {
  error: Error
  reset: () => void
}

export function AsyncErrorFallback({ error, reset }: AsyncErrorFallbackProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800">Gagal memuat data</h3>
          <p className="text-sm text-red-600 mt-1">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            onClick={reset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Route Error Component
// ============================================

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="max-w-lg w-full text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground">
                We&apos;ve encountered an unexpected error. Our team has been notified.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
