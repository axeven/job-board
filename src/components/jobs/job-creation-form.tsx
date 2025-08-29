'use client'

import { useActionState, useRef, useState, useTransition, useEffect } from 'react'
import { createJobAction, createDraftJobAction, type ActionState } from '@/lib/actions/job-actions'
import { FormField } from '@/components/ui/form-field'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { JobTypeSelect } from './job-type-select'
import { FormActions } from './form-actions'
import { useToast } from '@/lib/toast-context'

const initialState: ActionState = {}

export function JobCreationForm() {
  const [state, formAction] = useActionState(createJobAction, initialState)
  const [draftState, draftFormAction] = useActionState(createDraftJobAction, initialState)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [isDraftSubmission, setIsDraftSubmission] = useState(false)
  const { toast } = useToast()
  
  // Handle success/error toasts
  useEffect(() => {
    if (state.success && !isDraftSubmission) {
      toast.success('Job posted successfully!', 'Your job posting is now live and visible to candidates.')
      setIsDraftSubmission(false)
    } else if (state.error && !isDraftSubmission) {
      toast.error('Failed to post job', state.error)
      setIsDraftSubmission(false)
    }
  }, [state, isDraftSubmission, toast])
  
  useEffect(() => {
    if (draftState.success && isDraftSubmission) {
      toast.success('Draft saved successfully!', 'You can continue editing your job posting later.')
      setIsDraftSubmission(false)
    } else if (draftState.error && isDraftSubmission) {
      toast.error('Failed to save draft', draftState.error)
      setIsDraftSubmission(false)
    }
  }, [draftState, isDraftSubmission, toast])
  
  const handleDraftSave = () => {
    if (formRef.current) {
      setIsDraftSubmission(true)
      const formData = new FormData(formRef.current)
      startTransition(() => {
        draftFormAction(formData)
      })
    }
  }
  
  const currentState = isDraftSubmission ? draftState : state
  
  return (
    <form ref={formRef} action={formAction} className="space-y-8" noValidate>
      <div className="space-y-6">
        {/* Job Title */}
        <FormField
          label="Job Title"
          name="title"
          type="text"
          placeholder="e.g. Senior Frontend Developer"
          required
          error={currentState?.errors?.title?.[0]}
          helperText="Enter a clear, descriptive job title that candidates will search for"
          maxLength={100}
        />
        
        {/* Company Name */}
        <FormField
          label="Company Name"
          name="company"
          type="text"
          placeholder="e.g. TechCorp Inc."
          required
          error={currentState?.errors?.company?.[0]}
          helperText="Your company or organization name"
          maxLength={100}
        />
        
        {/* Location */}
        <FormField
          label="Location"
          name="location"
          type="text"
          placeholder="e.g. San Francisco, CA or Remote"
          required
          error={currentState?.errors?.location?.[0]}
          helperText="City, state/country, or specify if remote work is available"
          maxLength={100}
        />
        
        {/* Job Type */}
        <JobTypeSelect
          name="job_type"
          error={currentState?.errors?.job_type}
        />
        
        {/* Job Description */}
        <RichTextEditor
          name="description"
          label="Job Description"
          placeholder="Describe the role, responsibilities, requirements, qualifications, benefits, and what makes this opportunity exciting..."
          error={currentState?.errors?.description}
          required
          maxLength={5000}
        />
      </div>
      
      {/* Form Actions */}
      <FormActions 
        state={currentState}
        submitText="Post Job"
        showDraftButton={true}
        onDraft={handleDraftSave}
      />
    </form>
  )
}