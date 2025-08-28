import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { authServer } from '@/lib/auth/server'
import { LoginForm } from '@/components/auth/login-form'
import { FormLoading } from '@/components/auth/auth-loading'
import { AuthError } from '@/components/auth/auth-error'

export const metadata: Metadata = {
  title: 'Sign In - Job Board',
  description: 'Sign in to your Job Board account to post and manage jobs',
}

export default async function LoginPage() {
  // Redirect if already authenticated
  const user = await authServer.getUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<FormLoading />}>
      <AuthError />
      <LoginFormWrapper />
    </Suspense>
  )
}

function LoginFormWrapper() {
  return <LoginForm />
}