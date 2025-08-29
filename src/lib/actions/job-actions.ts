'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { authServer } from '@/lib/auth/server'
import { jobsServer } from '@/lib/database/jobs'
import { jobSchema } from '@/lib/schemas/job-schema'

export type ActionState = {
  errors?: {
    title?: string[]
    company?: string[]
    description?: string[]
    location?: string[]
    job_type?: string[]
  }
  message?: string
}

export async function createJobAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  return await createJobWithStatus(prevState, formData, 'active')
}

export async function createDraftJobAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  return await createJobWithStatus(prevState, formData, 'draft')
}

async function createJobWithStatus(
  prevState: ActionState | undefined,
  formData: FormData,
  status: 'active' | 'draft'
): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate form data
  const validatedFields = jobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    description: formData.get('description'),
    location: formData.get('location'),
    job_type: formData.get('job_type'),
  })
  
  // Return validation errors if invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check your inputs.'
    }
  }
  
  // Attempt to create the job
  try {
    const jobData = {
      ...validatedFields.data,
      status,
      user_id: user.id
    }
    
    const result = await jobsServer.create(jobData)
    
    if (result.error) {
      return {
        message: `Failed to ${status === 'draft' ? 'save draft' : 'create job posting'}: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    
    if (status === 'active') {
      // Redirect to the created job page for active jobs
      redirect(`/jobs/${result.data.id}`)
    } else {
      // For drafts, redirect to dashboard/jobs with success message
      return {
        message: 'Draft saved successfully! You can publish it later from your dashboard.'
      }
    }
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw redirect errors
    }
    
    console.error('Job creation error:', error)
    return {
      message: `Failed to ${status === 'draft' ? 'save draft' : 'create job posting'}. Please try again.`
    }
  }
}

export async function updateJobAction(
  jobId: string,
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate job ownership
  const isOwner = await jobsServer.validateOwnership(jobId, user.id)
  if (!isOwner) {
    return {
      message: 'You are not authorized to edit this job posting.'
    }
  }
  
  // Validate form data
  const validatedFields = jobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    description: formData.get('description'),
    location: formData.get('location'),
    job_type: formData.get('job_type'),
  })
  
  // Return validation errors if invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check your inputs.'
    }
  }
  
  // Attempt to update the job
  try {
    const result = await jobsServer.update(jobId, validatedFields.data)
    
    if (result.error) {
      return {
        message: `Failed to update job posting: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    revalidatePath(`/jobs/${jobId}`)
    revalidatePath(`/dashboard/jobs/${jobId}/edit`)
    
    return {
      message: 'Job posting updated successfully!'
    }
  } catch (error) {
    console.error('Job update error:', error)
    return {
      message: 'Failed to update job posting. Please try again.'
    }
  }
}

export async function deleteJobAction(jobId: string, permanent: boolean = false): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate job ownership
  const isOwner = await jobsServer.validateOwnership(jobId, user.id)
  if (!isOwner) {
    return {
      message: 'You are not authorized to delete this job posting.'
    }
  }
  
  // Attempt to delete the job
  try {
    const result = permanent 
      ? await jobsServer.hardDeleteJob(jobId, user.id)
      : await jobsServer.softDeleteJob(jobId, user.id)
    
    if (result.error) {
      return {
        message: `Failed to delete job posting: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    
    return {
      message: permanent 
        ? 'Job posting permanently deleted successfully!' 
        : 'Job posting deleted successfully!'
    }
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw redirect errors
    }
    
    console.error('Job deletion error:', error)
    return {
      message: 'Failed to delete job posting. Please try again.'
    }
  }
}

export async function restoreJobAction(jobId: string): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate job ownership
  const isOwner = await jobsServer.validateOwnership(jobId, user.id)
  if (!isOwner) {
    return {
      message: 'You are not authorized to restore this job posting.'
    }
  }
  
  // Attempt to restore the job
  try {
    const result = await jobsServer.restoreJob(jobId, user.id)
    
    if (result.error) {
      return {
        message: `Failed to restore job posting: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    
    return {
      message: 'Job posting restored successfully!'
    }
  } catch (error) {
    console.error('Job restoration error:', error)
    return {
      message: 'Failed to restore job posting. Please try again.'
    }
  }
}

export async function publishDraftJobAction(jobId: string): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate job ownership
  const isOwner = await jobsServer.validateOwnership(jobId, user.id)
  if (!isOwner) {
    return {
      message: 'You are not authorized to publish this job posting.'
    }
  }
  
  // Attempt to publish the draft job
  try {
    const result = await jobsServer.updateJobStatus(jobId, user.id, 'active')
    
    if (result.error) {
      return {
        message: `Failed to publish job posting: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    revalidatePath(`/jobs/${jobId}`)
    
    return {
      message: 'Job posting published successfully!'
    }
  } catch (error) {
    console.error('Job publication error:', error)
    return {
      message: 'Failed to publish job posting. Please try again.'
    }
  }
}

export async function updateJobStatusAction(jobId: string, status: 'active' | 'closed'): Promise<ActionState> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Validate job ownership
  const isOwner = await jobsServer.validateOwnership(jobId, user.id)
  if (!isOwner) {
    return {
      message: 'You are not authorized to update this job posting.'
    }
  }
  
  // Attempt to update job status
  try {
    const result = await jobsServer.updateJobStatus(jobId, user.id, status)
    
    if (result.error) {
      return {
        message: `Failed to update job status: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    revalidatePath(`/jobs/${jobId}`)
    
    return {
      message: `Job posting ${status === 'active' ? 'activated' : 'closed'} successfully!`
    }
  } catch (error) {
    console.error('Job status update error:', error)
    return {
      message: 'Failed to update job status. Please try again.'
    }
  }
}

export async function duplicateJobAction(jobId: string): Promise<ActionState & { duplicatedJobId?: string }> {
  // Require authentication
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Attempt to duplicate the job
  try {
    const result = await jobsServer.duplicateJob(jobId, user.id)
    
    if (result.error) {
      return {
        message: `Failed to duplicate job: ${result.error.message}`
      }
    }
    
    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/jobs')
    
    return {
      message: 'Job duplicated successfully! You can now edit the copy.',
      duplicatedJobId: result.data.id
    }
  } catch (error) {
    console.error('Job duplication error:', error)
    return {
      message: 'Failed to duplicate job. Please try again.'
    }
  }
}