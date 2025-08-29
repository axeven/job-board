import { Button } from '@/components/ui'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 text-error-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Something went wrong
        </h2>
        
        <p className="text-neutral-600 mb-6">
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-base text-left">
            <p className="text-sm font-medium text-error-800 mb-2">Error Details:</p>
            <pre className="text-xs text-error-700 whitespace-pre-wrap overflow-x-auto">
              {error.message}
            </pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <Button onClick={resetError} variant="primary">
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  )
}

export function NetworkErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 text-warning-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Connection Error
        </h2>
        
        <p className="text-neutral-600 mb-6">
          Unable to connect to the server. Please check your internet connection and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <Button onClick={resetError} variant="primary">
              Retry
            </Button>
          )}
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  )
}

export function NotFoundFallback() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl font-bold text-neutral-300 mb-6">404</div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-neutral-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            Go Back
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="primary"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}