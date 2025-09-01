'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { authClient } from '@/lib/auth/client'
import { signupSchema, SignupFormData } from '@/lib/auth/validation'
import { FormField } from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: searchParams.get('userType') as 'employer' | 'job_seeker' | undefined
    }
  })

  // Set default user type based on URL parameter
  useEffect(() => {
    const userType = searchParams.get('userType')
    if (userType === 'employer' || userType === 'job_seeker') {
      setValue('userType', userType)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true)
      setError(null)

      await authClient.signUp(data.email, data.password, data.userType)
      
      setSuccess(true)
      onSuccess?.()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-900">Check your email</h3>
          <p className="mt-1 text-sm text-green-700">
            We&apos;ve sent a verification link to your email address. Please check your email and click
            the link to activate your account.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <FormField
          label="Email address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          helperText="Must contain at least 6 characters with uppercase, lowercase, and number"
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            I am a <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="job_seeker"
                {...register('userType')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Job Seeker</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="employer"
                {...register('userType')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Employer</span>
            </label>
          </div>
          {errors.userType && (
            <p className="text-sm text-red-600">{errors.userType.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create account
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}