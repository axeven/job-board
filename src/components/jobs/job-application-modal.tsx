'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, ModalHeader, ModalContent } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'
import { applicationsClient } from '@/lib/database/applications'
import type { Job } from '@/types/database'

const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters'),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface JobApplicationModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function JobApplicationModal({ job, isOpen, onClose, onSuccess }: JobApplicationModalProps) {
  const { user, isJobSeeker, isEmployer } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: `Dear ${job.company} Hiring Team,

I am writing to express my interest in the ${job.title} position. I am excited about the opportunity to contribute to your team and believe my skills and experience make me a strong candidate for this role.

[Please customize this cover letter with your specific qualifications and why you're interested in this position]

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your name]`
    }
  })

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      setError('Please sign in to apply for jobs')
      return
    }

    if (isEmployer) {
      setError('Employers cannot apply for jobs. Please create a job seeker account if you wish to apply for positions.')
      return
    }

    if (!isJobSeeker) {
      setError('Please complete your profile setup to apply for jobs')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: applicationError } = await applicationsClient.create({
        job_id: job.id,
        applicant_id: user.id,
        cover_letter: data.coverLetter,
        status: 'pending'
      })

      if (applicationError) throw applicationError

      onSuccess()
      handleClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Don't show modal if user is not a job seeker
  if (isEmployer) {
    return (
      <Modal open={isOpen} onClose={handleClose}>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Cannot Apply</h2>
        </ModalHeader>
        <ModalContent>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Employers cannot apply for jobs. If you need to apply for a position, please create a job seeker account.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ModalHeader>
        <h2 className="text-xl font-semibold">Apply for {job.title}</h2>
        <p className="text-gray-600">{job.company} • {job.location}</p>
      </ModalHeader>
      
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('coverLetter')}
              rows={12}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.coverLetter 
                  ? 'border-red-300 text-red-900' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="Write your cover letter..."
            />
            {errors.coverLetter && (
              <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Personalize your application by explaining why you&apos;re interested in this role and how your skills match the job requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="sm:flex-1"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}