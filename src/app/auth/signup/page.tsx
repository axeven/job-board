import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { authServer } from '@/lib/auth/server'
import { SignupForm } from '@/components/auth/signup-form'
import { FormLoading } from '@/components/auth/auth-loading'

export const metadata: Metadata = {
  title: 'Create Account - Job Board',
  description: 'Create a new Job Board account to start posting and managing jobs',
}

export default async function SignupPage() {
  // Redirect if already authenticated
  const user = await authServer.getUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<FormLoading />}>
      <SignupFormWrapper />
    </Suspense>
  )
}

function SignupFormWrapper() {
  return <SignupForm />
}