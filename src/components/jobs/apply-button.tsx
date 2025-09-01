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
  const { user, isJobSeeker, isEmployer } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const handleApply = async () => {
    if (!user) {
      toast.error('Authentication Required', 'Please sign in to apply for jobs.')
      return
    }

    if (isEmployer) {
      toast.error('Access Denied', 'Employers cannot apply for jobs. Please create a job seeker account if you wish to apply for positions.')
      return
    }

    if (!isJobSeeker) {
      toast.error('Profile Required', 'Please complete your profile setup to apply for jobs.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await applicationsClient.create({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: '', // Empty cover letter for quick apply
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
      <Button disabled variant="outline" className={className}>
        Applied
      </Button>
    )
  }

  if (isEmployer) {
    return (
      <Button disabled variant="outline" className={className}>
        Employers Cannot Apply
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