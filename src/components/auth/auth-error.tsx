'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ERROR_MESSAGES = {
  'invalid_credentials': 'Invalid email or password. Please try again.',
  'email_not_confirmed': 'Please check your email and click the verification link.',
  'signup_disabled': 'Account registration is currently disabled.',
  'email_rate_limit': 'Too many email requests. Please wait before trying again.',
  'invalid_request': 'Invalid request. Please try again.',
  'server_error': 'Server error. Please try again later.',
  'Authentication failed': 'Authentication failed. Please try again.',
} as const

export function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (!error) return null

  const errorMessage = ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] || error

  return (
    <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-4 w-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-2">
          <p>{errorMessage}</p>
          {error === 'email_not_confirmed' && (
            <p className="mt-2">
              <Link
                href="/auth/signup"
                className="font-medium underline hover:no-underline"
              >
                Resend verification email
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}