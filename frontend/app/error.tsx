'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Something went wrong!</h1>
          <p className="text-text-secondary mb-6">
            We encountered an unexpected error. Please try again.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
              <p className="text-sm font-mono text-red-600 dark:text-red-400">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-500 dark:text-red-300 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          <p className="text-sm text-text-secondary mt-6">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-accent hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
