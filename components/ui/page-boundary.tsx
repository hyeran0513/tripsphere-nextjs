"use client"

import { Component, Suspense, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

type ErrorBoundaryProps = {
  fallback: (error: Error, reset: () => void) => ReactNode
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error(error)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}

function DefaultLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="skeleton h-8 w-40" />
      <div className="skeleton h-48 w-full rounded-lg" />
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  )
}

function DefaultError(error: Error, reset: () => void) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-base-content/60">
      <AlertTriangle className="mb-3 size-12 text-error" />
      <p className="text-lg font-medium">문제가 발생했습니다</p>
      {error.message && <p className="mt-1 text-sm text-base-content/50">{error.message}</p>}
      <button type="button" className="btn btn-primary btn-sm mt-4" onClick={reset}>
        다시 시도
      </button>
    </div>
  )
}

type PageBoundaryProps = {
  children: ReactNode
  loadingFallback?: ReactNode
  errorFallback?: (error: Error, reset: () => void) => ReactNode
}

export function PageBoundary({
  children,
  loadingFallback = <DefaultLoading />,
  errorFallback = DefaultError,
}: PageBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
