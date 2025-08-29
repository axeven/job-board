import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { AuthButton } from '@/components/auth/auth-button'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <h1 className="text-xl font-bold text-gray-900">Job Board</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link 
                href="/jobs" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Browse Jobs
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex sm:items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {displayName}
                </span>
              </div>
            </div>
            <AuthButton variant="outline" size="sm" showProfile={false} />
          </div>
        </div>
      </div>
    </header>
  )
}