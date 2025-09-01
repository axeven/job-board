'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EmployerOnlyNoticeProps {
  title?: string
  description?: string
  showUpgradeButton?: boolean
}

export function EmployerOnlyNotice({
  title = "Employer Access Required",
  description = "Only employers can post jobs. Job seekers can browse and apply to job listings.",
  showUpgradeButton = true
}: EmployerOnlyNoticeProps) {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          {title}
        </h3>
        
        <p className="text-blue-800 mb-4">
          {description}
        </p>
        
        {showUpgradeButton && (
          <div className="space-y-2">
            <Button
              as={Link}
              href="/auth/signup?userType=employer"
              variant="primary"
              size="sm"
              className="w-full"
            >
              Create Employer Account
            </Button>
            
            <Button
              as={Link}
              href="/jobs"
              variant="outline"
              size="sm"
              className="w-full"
            >
              Browse Jobs Instead
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}