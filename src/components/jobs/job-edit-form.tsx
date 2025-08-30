'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateJobAction, type ActionState } from '@/lib/actions/job-actions'
import { FormField } from '@/components/ui/form-field'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { JobTypeSelect } from './job-type-select'
import { UnsavedChangesGuard } from './unsaved-changes-guard'
import type { Tables } from '@/types/supabase'
import type { JobType } from '@/types/database'

type Job = Tables<'jobs'>

interface JobEditFormProps {
  job: Job
}

const initialState: ActionState = {}

export function JobEditForm({ job }: JobEditFormProps) {
  const [state, formAction] = useActionState(
    (prevState: ActionState, formData: FormData) => updateJobAction(job.id, prevState, formData),
    initialState
  )
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Track form values for AI context
  const [formValues, setFormValues] = useState({
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.job_type
  })
  
  // Track form changes
  useEffect(() => {
    const form = document.querySelector('form[data-job-edit-form]')
    if (!form) return
    
    const handleFormChange = () => {
      if (!isSubmitting) {
        setHasUnsavedChanges(true)
      }
    }
    
    form.addEventListener('input', handleFormChange)
    form.addEventListener('change', handleFormChange)
    
    return () => {
      form.removeEventListener('input', handleFormChange)
      form.removeEventListener('change', handleFormChange)
    }
  }, [isSubmitting])
  
  // Handle successful update
  useEffect(() => {
    if (state?.message && !state?.errors && !isSubmitting) {
      setHasUnsavedChanges(false)
      // Show success message and optionally redirect
      if (state.message.includes('successfully')) {
        // Success - could show a toast here
        setTimeout(() => {
          router.push('/dashboard/jobs')
        }, 1500)
      }
    }
  }, [state, router, isSubmitting])
  
  // Handle field changes for AI context
  const handleFieldChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await formAction(formData)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
        router.push('/dashboard/jobs')
      }
    } else {
      router.push('/dashboard/jobs')
    }
  }
  
  return (
    <>
      <UnsavedChangesGuard hasUnsavedChanges={hasUnsavedChanges} />
      
      <form 
        action={handleSubmit} 
        className="space-y-8 p-6" 
        noValidate
        data-job-edit-form
      >
        {/* Success Message */}
        {state?.message && !state?.errors && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {state.message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  You have unsaved changes. Make sure to save your changes before leaving.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Job Title */}
          <FormField
            label="Job Title"
            name="title"
            type="text"
            placeholder="e.g. Senior Frontend Developer"
            required
            error={state?.errors?.title?.[0]}
            helperText="Enter a clear, descriptive job title that candidates will search for"
            maxLength={100}
            defaultValue={job.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
          />
          
          {/* Company Name */}
          <FormField
            label="Company Name"
            name="company"
            type="text"
            placeholder="e.g. TechCorp Inc."
            required
            error={state?.errors?.company?.[0]}
            helperText="Your company or organization name"
            maxLength={100}
            defaultValue={job.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
          />
          
          {/* Location */}
          <FormField
            label="Location"
            name="location"
            type="text"
            placeholder="e.g. San Francisco, CA or Remote"
            required
            error={state?.errors?.location?.[0]}
            helperText="City, state/country, or specify if remote work is available"
            maxLength={100}
            defaultValue={job.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
          />
          
          {/* Job Type */}
          <JobTypeSelect
            name="job_type"
            error={state?.errors?.job_type}
            defaultValue={job.job_type as JobType}
            onChange={(value) => handleFieldChange('jobType', value)}
          />
          
          {/* Job Description */}
          <RichTextEditor
            name="description"
            label="Job Description"
            placeholder="Describe the role, responsibilities, requirements, qualifications, benefits, and what makes this opportunity exciting..."
            error={state?.errors?.description}
            required
            maxLength={5000}
            defaultValue={job.description}
            enableAIEnhancement={true}
            jobContext={formValues}
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
          
          {/* Last saved indicator */}
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(job.updated_at || job.created_at || new Date()).toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* General Error Message */}
        {state?.message && state?.errors && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {state.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExclamationTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}