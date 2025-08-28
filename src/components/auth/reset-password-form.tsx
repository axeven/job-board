'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase/client'
import { newPasswordSchema, NewPasswordFormData } from '@/lib/auth/validation'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token: _ }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema)
  })

  const onSubmit = async (data: NewPasswordFormData) => {
    try {
      setLoading(true)
      setError(null)

      // Update password using the reset token
      const { error: updateError } = await supabase().auth.updateUser({
        password: data.password
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      setSuccess(true)
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-900">Password Updated</h3>
          <p className="mt-1 text-sm text-green-700">
            Your password has been successfully updated. You&apos;re being redirected to your dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          helperText="Must contain at least 6 characters with uppercase, lowercase, and number"
          {...register('password')}
        />

        <FormField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Update password
        </Button>
      </form>
    </div>
  )
}