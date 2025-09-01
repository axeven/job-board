'use client'

import { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/database'

interface ProfileCardProps {
  user: User | null
  profile: UserProfile | null
}

export function ProfileCard({ user, profile }: ProfileCardProps) {
  // Handle case where user is null
  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Unable to load profile information.</p>
      </div>
    )
  }
  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get user type display text
  const getUserTypeDisplay = () => {
    if (profile?.user_type === 'job_seeker') return 'Job Seeker'
    if (profile?.user_type === 'employer') return 'Employer'
    return 'Not specified'
  }

  // Get initials for avatar
  const getInitials = () => {
    const name = profile?.full_name || user?.email || 'User'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with avatar */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {getInitials()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {profile?.full_name || 'Welcome!'}
            </h2>
            <p className="text-blue-100">
              {getUserTypeDisplay()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {user.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {profile?.full_name || 'Not provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {getUserTypeDisplay()}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono text-sm">
                {user.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Confirmed
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.email_confirmed_at 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {formatDate(user.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Sign In
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {formatDate(user.last_sign_in_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Data Section */}
        {profile?.profile_data && Object.keys(profile.profile_data as Record<string, unknown>).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Profile Information
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(profile.profile_data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Resume Section for Job Seekers */}
        {profile?.user_type === 'job_seeker' && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resume
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              {profile.resume_file_path ? (
                <div className="flex items-center space-x-2">
                  <DocumentIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">Resume uploaded</span>
                  <span className="text-sm text-gray-500">
                    ({profile.resume_file_path})
                  </span>
                </div>
              ) : (
                <p className="text-gray-600 italic">No resume uploaded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}