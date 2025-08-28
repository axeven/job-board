'use client'

interface JobErrorStateProps {
  error: string
}

export function JobErrorState({ error }: JobErrorStateProps) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="mt-8 text-center">
      <div className="p-6 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Unable to load jobs
        </h3>
        <p className="text-sm text-red-700 mb-4">
          {error}
        </p>
        <button 
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  )
}