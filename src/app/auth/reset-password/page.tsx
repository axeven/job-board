import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

import { authServer } from '@/lib/auth/server'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { FormLoading } from '@/components/auth/auth-loading'

export const metadata: Metadata = {
  title: 'Set New Password - Job Board',
  description: 'Set a new password for your Job Board account',
}

interface ResetPasswordPageProps {
  searchParams: { token?: string; error?: string }
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // Redirect if already authenticated
  const user = await authServer.getUser()
  if (user) {
    redirect('/dashboard')
  }

  const { token, error } = searchParams

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-900">Reset Failed</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Request a new reset link
        </Link>
      </div>
    )
  }

  if (!token) {
    redirect('/auth/forgot-password')
  }

  return (
    <Suspense fallback={<FormLoading />}>
      <ResetPasswordForm token={token} />
    </Suspense>
  )
}