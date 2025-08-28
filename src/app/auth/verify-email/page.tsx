import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verify Email - Job Board',
  description: 'Please verify your email address to complete registration',
}

export default function VerifyEmailPage() {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve sent a verification link to your email address.
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-left">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Next steps:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Check your email inbox (and spam folder)</li>
          <li>Click the verification link in the email</li>
          <li>You&apos;ll be automatically signed in and redirected to your dashboard</li>
        </ol>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Didn&apos;t receive the email? Check your spam folder or contact support.
        </p>
        
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}