'use client'

import { useActionState } from 'react'
import { createJobAction, type ActionState } from '@/lib/actions/job-actions'
import { FormField } from '@/components/ui/form-field'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { JobTypeSelect } from './job-type-select'
import { FormActions } from './form-actions'

const initialState: ActionState = {}

export function JobCreationForm() {
  const [state, formAction] = useActionState(createJobAction, initialState)
  
  return (
    <form action={formAction} className="space-y-8" noValidate>
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
        />
        
        {/* Job Type */}
        <JobTypeSelect
          name="job_type"
          error={state?.errors?.job_type}
        />
        
        {/* Job Description */}
        <RichTextEditor
          name="description"
          label="Job Description"
          placeholder="Describe the role, responsibilities, requirements, qualifications, benefits, and what makes this opportunity exciting..."
          error={state?.errors?.description}
          required
          maxLength={5000}
        />
      </div>
      
      {/* Form Actions */}
      <FormActions 
        state={state}
        submitText="Post Job"
      />
    </form>
  )
}