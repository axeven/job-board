'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ApplicationFormModal } from '@/components/applications/application-form-modal'
import { useAuth } from '@/lib/auth/context'
import { applicationsClient } from '@/lib/database/applications'
import { useToast } from '@/lib/toast-context'
import { useRouter } from 'next/navigation'

interface ApplyButtonProps {
  jobId: string
  jobTitle: string
  companyName: string
  location: string
  jobType: string
  className?: string
}

export function ApplyButton({ 
  jobId, 
  jobTitle, 
  companyName, 
  location, 
  jobType, 
  className 
}: ApplyButtonProps) {
  const { user, isJobSeeker, isEmployer, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [hasApplied, setHasApplied] = useState(false)
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Check if user has already applied
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user) return
      
      setIsCheckingApplication(true)
      try {
        const { hasApplied: userHasApplied } = await applicationsClient.hasApplied(jobId, user.id)
        setHasApplied(userHasApplied)
      } catch (error) {
        console.error('Error checking application status:', error)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    checkExistingApplication()
  }, [user, jobId])

  const handleApplyClick = () => {
    if (!user) {
      toast.error('Authentication Required', 'Please sign in to apply for jobs.')
      router.push('/auth/login?redirectTo=' + encodeURIComponent(window.location.pathname))
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

    if (hasApplied) {
      return // Already applied
    }

    setShowModal(true)
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowModal(false)
  }

  const getButtonText = () => {
    if (loading || isCheckingApplication) return 'Loading...'
    if (hasApplied) return 'Applied ✓'
    if (isEmployer) return 'Employers Cannot Apply'
    if (!user) return 'Sign In to Apply'
    return 'Apply Now'
  }

  const isDisabled = loading || isCheckingApplication || hasApplied || isEmployer

  return (
    <>
      <Button
        onClick={handleApplyClick}
        loading={loading || isCheckingApplication}
        disabled={isDisabled}
        variant={hasApplied || isEmployer ? 'outline' : 'primary'}
        className={className}
      >
        {getButtonText()}
      </Button>

      <ApplicationFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleApplicationSuccess}
        jobId={jobId}
        jobTitle={jobTitle}
        companyName={companyName}
        location={location}
        jobType={jobType}
      />
    </>
  )
}