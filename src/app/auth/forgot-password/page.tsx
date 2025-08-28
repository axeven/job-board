import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { authServer } from '@/lib/auth/server'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Reset Password - Job Board',
  description: 'Reset your Job Board account password',
}

// Force dynamic rendering since this page uses server-side auth
export const dynamic = 'force-dynamic'

export default async function ForgotPasswordPage() {
  // Redirect if already authenticated
  const user = await authServer.getUser()
  if (user) {
    redirect('/dashboard')
  }

  return <ForgotPasswordForm />
}