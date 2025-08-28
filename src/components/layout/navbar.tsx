'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Job Board</h1>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Browse Jobs
              </Link>
              
              {user && (
                <>
                  <Link
                    href="/post-job"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Post a Job
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && !user && (
              <Button
                as={Link}
                href="/post-job"
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Post a Job
              </Button>
            )}
            
            <AuthButton size="sm" showProfile={false} />
          </div>

          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2 rounded-md"
              aria-label="Open main menu"
            >
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu />
    </nav>
  )
}

function MobileMenu() {
  const { user } = useAuth()

  return (
    <div className="sm:hidden border-t border-gray-200">
      <div className="px-2 py-3 space-y-1">
        <Link
          href="/jobs"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
        >
          Browse Jobs
        </Link>
        
        {user && (
          <>
            <Link
              href="/post-job"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Post a Job
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}