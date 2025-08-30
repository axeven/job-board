'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Return custom fallback UI or default fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                AI Enhancement Unavailable
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                The AI enhancement feature is temporarily unavailable. You can still create and edit your job description manually.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}