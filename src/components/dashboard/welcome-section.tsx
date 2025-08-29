import Link from 'next/link'

interface WelcomeSectionProps {
  userName: string
  hasJobs: boolean
}

export function WelcomeSection({ userName, hasJobs }: WelcomeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName}! 👋
          </h2>
          <p className="mt-2 text-gray-600">
            {hasJobs 
              ? "Here's what's happening with your job postings today."
              : "Ready to post your first job? Get started and reach thousands of candidates."}
          </p>
        </div>
        
        <div className="mt-6 lg:mt-0 lg:ml-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
            {hasJobs && (
              <Link
                href="/dashboard/jobs"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <ViewGridIcon className="w-4 h-4 mr-2" />
                View All Jobs
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {!hasJobs && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <LightBulbIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Tips for effective job posting
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Write a clear, specific job title</li>
                  <li>Include detailed job responsibilities and requirements</li>
                  <li>Mention your company culture and benefits</li>
                  <li>Be specific about the location and job type</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function ViewGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function LightBulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}