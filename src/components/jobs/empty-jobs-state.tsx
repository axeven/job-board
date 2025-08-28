import Link from 'next/link'

export function EmptyJobsState() {
  return (
    <div className="mt-12 text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No jobs available yet
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Be the first to discover great opportunities! Check back soon as companies are constantly posting new positions.
      </p>
      
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Back to Home
        </Link>
        
        <Link
          href="/post-job"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Post a Job
        </Link>
      </div>
    </div>
  )
}