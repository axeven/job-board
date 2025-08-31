'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'
import { applicationsClient } from '@/lib/database/applications'
import { useToast } from '@/lib/toast-context'

interface ApplyButtonProps {
  jobId: string
  className?: string
}

export function ApplyButton({ jobId, className }: ApplyButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  // Check if user has already applied (implement useEffect)
  // For Phase 1, we'll keep it simple

  const handleApply = async () => {
    if (!user) {
      toast.error('Authentication Required', 'Please sign in to apply for jobs.')
      return
    }

    setIsLoading(true)
    try {
      // Simple application without cover letter for Phase 1
      const { error } = await applicationsClient.create({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: '', // Empty for Phase 1
        status: 'pending'
      })

      if (error) throw error

      setHasApplied(true)
      toast.success('Application Submitted', 'Your application has been submitted successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application'
      toast.error('Application Failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (hasApplied) {
    return (
      <Button disabled className={className}>
        Applied
      </Button>
    )
  }

  return (
    <Button
      onClick={handleApply}
      loading={isLoading}
      className={className}
    >
      Apply Now
    </Button>
  )
}