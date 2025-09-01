'use client'

import { useState } from 'react'
import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { useAuth } from '@/lib/auth/context'
import { useToast } from '@/lib/toast-context'
import { applicationsClient } from '@/lib/database/applications'
import { getResumeUploadUrl, uploadResumeFile } from '@/lib/storage/resume-storage'
import type { ApplicationFormData } from '@/lib/schemas/application-schema'
import { Building, MapPin, Briefcase, AlertCircle } from 'lucide-react'

interface ApplicationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  jobId: string
  jobTitle: string
  companyName: string
  location: string
  jobType: string
}

export function ApplicationFormModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  jobId,
  jobTitle,
  companyName,
  location,
  jobType
}: ApplicationFormModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setCoverLetter('')
    setResumeFile(null)
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate cover letter
    if (!coverLetter.trim()) {
      newErrors.cover_letter = 'Cover letter is required'
    } else if (coverLetter.length < 50) {
      newErrors.cover_letter = 'Cover letter must be at least 50 characters'
    } else if (coverLetter.length > 2000) {
      newErrors.cover_letter = 'Cover letter must be less than 2000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Authentication Required', 'Please sign in to apply for jobs.')
      return
    }

    if (!validateForm()) {
      toast.error('Validation Error', 'Please fix the form errors and try again.')
      return
    }

    setIsSubmitting(true)
    
    try {
      let resumeFilePath: string | undefined

      // Upload resume file if provided
      if (resumeFile) {
        // Get presigned upload URL
        const { uploadUrl, filePath, error: urlError } = await getResumeUploadUrl(user.id, resumeFile.name)
        
        if (urlError) {
          throw new Error(urlError)
        }

        if (!uploadUrl || !filePath) {
          throw new Error('Failed to get upload URL')
        }

        // Upload file using presigned URL
        const { error: uploadError } = await uploadResumeFile(resumeFile, uploadUrl)
        
        if (uploadError) {
          throw new Error(uploadError)
        }

        resumeFilePath = filePath
      }

      // Create application
      const applicationData: Omit<ApplicationFormData, 'job_id'> & { job_id: string; applicant_id: string; status: 'pending' } = {
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter.trim(),
        resume_file_path: resumeFilePath,
        status: 'pending'
      }

      const { error } = await applicationsClient.create(applicationData)

      if (error) {
        throw error
      }

      toast.success(
        'Application Submitted!', 
        `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`
      )

      resetForm()
      onSuccess()
      onClose()
      
    } catch (error) {
      console.error('Application submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit your application. Please try again.'
      toast.error('Submission Failed', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    resetForm()
    onClose()
  }

  const characterCount = coverLetter.length
  const isOverLimit = characterCount > 2000
  const isUnderMinimum = characterCount < 50

  return (
    <Modal 
      open={isOpen} 
      onClose={handleClose}
      size="lg"
      closeOnEscape={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalHeader 
        title="Apply for Position"
        onClose={isSubmitting ? undefined : handleClose}
        showCloseButton={!isSubmitting}
      >
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{jobTitle}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{companyName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>{jobType}</span>
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {/* Cover Letter Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Cover Letter *
            </label>
            <span className={`text-xs ${
              isOverLimit ? 'text-red-600' : 
              isUnderMinimum ? 'text-amber-600' : 
              'text-gray-500'
            }`}>
              {characterCount}/2000 characters
            </span>
          </div>
          
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
            className={`w-full h-40 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cover_letter ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
            maxLength={2000}
          />
          
          {errors.cover_letter && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.cover_letter}</span>
            </div>
          )}
          
          {!errors.cover_letter && isUnderMinimum && coverLetter.length > 0 && (
            <p className="text-sm text-amber-600">
              Please write at least {50 - characterCount} more characters
            </p>
          )}
        </div>

        {/* Resume Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resume (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload your latest resume (PDF, DOC, DOCX - max 2MB)
          </p>
          
          <FileUpload
            onFileSelect={setResumeFile}
            selectedFile={resumeFile}
            disabled={isSubmitting}
            accept=".pdf,.doc,.docx"
            maxSize={2 * 1024 * 1024}
          />
        </div>
      </ModalContent>

      <ModalFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !coverLetter.trim() || isUnderMinimum || isOverLimit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}