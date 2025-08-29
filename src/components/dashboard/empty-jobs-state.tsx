import Link from 'next/link'

export function EmptyJobsState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
        <BriefcaseIcon className="h-10 w-10 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No job postings yet
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Ready to find your next great hire? Post your first job and start connecting with talented candidates today.
      </p>
      
      <div className="space-y-4">
        <Link
          href="/post-job"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Post Your First Job
        </Link>
        
        <div className="text-sm text-gray-500">
          It only takes a few minutes to get started
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 text-left">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <LightBulbIcon className="h-6 w-6 text-blue-500 mt-0.5" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">
              Tips for creating effective job postings
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Write a clear, specific job title that candidates will search for</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Include detailed responsibilities and requirements</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Mention your company culture, benefits, and growth opportunities</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Be specific about location (remote, hybrid, or on-site)</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Review and proofread before publishing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-6 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">10K+</div>
          <div className="text-sm text-gray-500">Active job seekers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">500+</div>
          <div className="text-sm text-gray-500">Companies hiring</div>
        </div>
      </div>
    </div>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}