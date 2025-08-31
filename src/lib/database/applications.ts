import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import type { JobApplicationInsert, ApplicationStatus } from '@/types/database'

export interface ApplicationFilters {
  status?: ApplicationStatus[]
  job_id?: string
  applicant_id?: string
}

// Client-side operations
export const applicationsClient = {
  // Apply to a job
  async create(application: JobApplicationInsert) {
    const client = supabase()
    return client
      .from('job_applications')
      .insert(application)
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          job_type
        )
      `)
      .single()
  },

  // Get user's applications
  async getByUser(userId: string, filters?: ApplicationFilters) {
    const client = supabase()
    let query = client
      .from('job_applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          job_type
        )
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false })

    if (filters?.status?.length) {
      query = query.in('status', filters.status)
    }

    return query
  },

  // Get applications for a job
  async getByJob(jobId: string, filters?: ApplicationFilters) {
    const client = supabase()
    let query = client
      .from('job_applications')
      .select(`
        *,
        user_profiles (
          full_name,
          user_type
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })

    if (filters?.status?.length) {
      query = query.in('status', filters.status)
    }

    return query
  },

  // Check if user has already applied
  async hasApplied(jobId: string, userId: string) {
    const client = supabase()
    const { data, error } = await client
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', userId)
      .single()

    return { hasApplied: !!data && !error, error }
  }
}

// Server-side operations
export const applicationsServer = {
  // Apply to a job (server-side)
  async create(application: JobApplicationInsert) {
    const supabase = await createClient()
    return supabase
      .from('job_applications')
      .insert({
        ...application,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          job_type
        )
      `)
      .single()
  },

  // Get user's applications with job details
  async getByUser(userId: string, filters?: ApplicationFilters) {
    const supabase = await createClient()
    let query = supabase
      .from('job_applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          job_type
        )
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false })

    if (filters?.status?.length) {
      query = query.in('status', filters.status)
    }

    return query
  },

  // Get applications for employer's job
  async getByJob(jobId: string, employerId: string, filters?: ApplicationFilters) {
    const supabase = await createClient()
    
    // First verify job ownership
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single()

    if (!job || job.user_id !== employerId) {
      return { data: null, error: { message: 'Unauthorized' } }
    }

    let query = supabase
      .from('job_applications')
      .select(`
        *,
        user_profiles (
          full_name,
          user_type
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })

    if (filters?.status?.length) {
      query = query.in('status', filters.status)
    }

    return query
  },

  // Update application status
  async updateStatus(applicationId: string, status: ApplicationStatus, employerId: string) {
    const supabase = await createClient()
    
    // Verify employer can update this application
    const { data: application } = await supabase
      .from('job_applications')
      .select(`
        id,
        jobs!inner(user_id)
      `)
      .eq('id', applicationId)
      .single()

    if (!application || application.jobs.user_id !== employerId) {
      return { data: null, error: { message: 'Unauthorized' } }
    }

    return supabase
      .from('job_applications')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()
  },

  // Check if user has applied
  async hasApplied(jobId: string, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', userId)
      .single()

    return { hasApplied: !!data && !error, error }
  }
}