'use client'

import { EmployerOnlyNotice } from '@/components/ui/employer-only-notice'

interface AccessDeniedProps {
  error: string
}

export function AccessDenied({ error }: AccessDeniedProps) {
  if (error === 'employer_access_required') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-8">You tried to access a feature that&apos;s only available to employers.</p>
        </div>
        
        <EmployerOnlyNotice
          title="Employer Features Required"
          description="The feature you tried to access is only available to employer accounts. Job seekers can browse jobs, apply for positions, and manage their applications."
          showUpgradeButton={true}
        />
      </div>
    )
  }

  if (error === 'insufficient_permissions') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permission Denied</h1>
          <p className="text-gray-600 mb-8">You don&apos;t have permission to access this feature.</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Access Denied
            </h3>
            
            <p className="text-red-800 mb-4">
              You don&apos;t have the required permissions to access this resource.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Generic error fallback
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">An Error Occurred</h1>
        <p className="text-gray-600 mb-8">Something went wrong while processing your request.</p>
      </div>
    </div>
  )
}