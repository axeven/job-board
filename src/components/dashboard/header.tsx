import { User } from '@supabase/supabase-js'
import { AuthButton } from '@/components/auth/auth-button'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
          </div>
          
          <AuthButton variant="outline" size="sm" />
        </div>
      </div>
    </header>
  )
}