'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

function BackToJobsButton() {
  const router = useRouter()
  
  const handleBack = () => {
    // Try to go back in history first, fallback to /jobs
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/jobs')
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Jobs
    </button>
  )
}

function BreadcrumbNavigation() {
  return (
    <nav className="flex mt-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
        </li>
        <li>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li>
          <Link href="/jobs" className="hover:text-gray-700">
            Jobs
          </Link>
        </li>
        <li>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li className="text-gray-900" aria-current="page">
          Job Details
        </li>
      </ol>
    </nav>
  )
}

export function JobDetailNavigation() {
  return (
    <nav className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <BackToJobsButton />
        <BreadcrumbNavigation />
      </div>
    </nav>
  )
}