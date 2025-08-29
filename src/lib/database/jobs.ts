import { supabase } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { JobInsert, JobUpdate, JobType } from '@/types/database'

export type JobStatus = 'active' | 'draft' | 'closed'

interface JobFilters {
  location: string[]
  jobType: ('Full-Time' | 'Part-Time' | 'Contract')[]
  searchQuery: string
}

interface MyJobsFilters {
  status: 'all' | JobStatus
  sort: 'newest' | 'oldest' | 'most_views'
  search: string
}

export interface JobsPagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Client-side operations
export const jobsClient = {
  // Get all jobs with optional filters
  async getAll(filters?: {
    job_type?: JobType
    location?: string
    search?: string
  }) {
    const client = supabase()
    let query = client
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (filters?.job_type) {
      query = query.eq('job_type', filters.job_type)
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    return query
  },

  // Get single job by ID
  async getById(id: string) {
    const client = supabase()
    return client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single()
  },

  // Create new job
  async create(job: JobInsert) {
    const client = supabase()
    return client
      .from('jobs')
      .insert(job)
      .select()
      .single()
  },

  // Update existing job
  async update(id: string, job: JobUpdate) {
    const client = supabase()
    return client
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single()
  },

  // Delete job
  async delete(id: string) {
    const client = supabase()
    return client
      .from('jobs')
      .delete()
      .eq('id', id)
  },

  // Get user's jobs
  async getByUser(userId: string) {
    const client = supabase()
    return client
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null) // Exclude soft-deleted jobs
      .order('created_at', { ascending: false })
  },

  // Get filtered jobs (new implementation)
  async getFiltered(filters: JobFilters) {
    const client = supabase()
    let query = client
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (filters.location.length > 0) {
      query = query.in('location', filters.location)
    }
    
    if (filters.jobType.length > 0) {
      query = query.in('job_type', filters.jobType)
    }
    
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
    }
    
    return query
  },

  // Get unique locations
  async getUniqueLocations() {
    const client = supabase()
    return client
      .from('jobs')
      .select('location')
      .eq('status', 'active')
      .is('deleted_at', null)
      .not('location', 'is', null)
      .not('location', 'eq', '')
  }
}

// Server-side operations (for Server Components)
export const jobsServer = {
  // Get all jobs with optional filters
  async getAll(filters?: {
    job_type?: JobType
    location?: string
    search?: string
  }) {
    const supabase = await createServerClient()
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (filters?.job_type) {
      query = query.eq('job_type', filters.job_type)
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    return query
  },

  // Get single job by ID
  async getById(id: string) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()
  },

  // Get user's jobs
  async getByUser(userId: string) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null) // Exclude soft-deleted jobs
      .order('created_at', { ascending: false })
  },

  // Get filtered jobs (new implementation)
  async getFiltered(filters: JobFilters) {
    const supabase = await createServerClient()
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (filters.location.length > 0) {
      query = query.in('location', filters.location)
    }
    
    if (filters.jobType.length > 0) {
      query = query.in('job_type', filters.jobType)
    }
    
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
    }
    
    return query
  },

  // Get unique locations
  async getUniqueLocations() {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .select('location')
      .eq('status', 'active')
      .is('deleted_at', null)
      .not('location', 'is', null)
      .not('location', 'eq', '')
  },

  // Get single job by ID
  async getJobById(id: string) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single()
  },

  // Get all job IDs for static generation
  async getAllJobIds() {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .select('id')
      .eq('status', 'active')
      .is('deleted_at', null)
  },

  // Create new job (server-side)
  async create(job: JobInsert) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .insert({
        ...job,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
  },

  // Update existing job (server-side)
  async update(id: string, job: JobUpdate) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .update({
        ...job,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete job (server-side)
  async delete(id: string) {
    const supabase = await createServerClient()
    return supabase
      .from('jobs')
      .delete()
      .eq('id', id)
  },

  // Validate job ownership
  async validateOwnership(jobId: string, userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single()
    
    if (error) return false
    return data.user_id === userId
  },

  // Get user's jobs with filters and pagination
  async getUserJobsWithFilters(
    userId: string, 
    filters: MyJobsFilters, 
    pagination: { page: number; limit: number }
  ) {
    const supabase = await createServerClient()
    const { page, limit } = pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null) // Exclude soft-deleted jobs
      .range(from, to)
    
    // Apply status filter
    if (filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    
    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'most_views':
        // For now, sort by created_at since we don't have views yet
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
    
    const result = await query
    
    return {
      ...result,
      pagination: {
        page,
        limit,
        total: result.count || 0,
        hasMore: (result.count || 0) > to + 1
      }
    }
  },

  // Update job status
  async updateJobStatus(jobId: string, userId: string, status: JobStatus) {
    const supabase = await createServerClient()
    
    // First verify ownership
    const isOwner = await this.validateOwnership(jobId, userId)
    if (!isOwner) {
      return { data: null, error: { message: 'Unauthorized' } }
    }
    
    return supabase
      .from('jobs')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single()
  },

  // Duplicate job
  async duplicateJob(jobId: string, userId: string) {
    const supabase = await createServerClient()
    
    // First get the original job
    const { data: originalJob, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single()
    
    if (fetchError || !originalJob) {
      return { data: null, error: { message: 'Job not found or unauthorized' } }
    }
    
    // Create the duplicate with modified title and draft status
    const duplicateJobData = {
      title: `${originalJob.title} (Copy)`,
      company: originalJob.company,
      description: originalJob.description,
      location: originalJob.location,
      job_type: originalJob.job_type,
      status: 'draft' as JobStatus,
      user_id: userId
    }
    
    return supabase
      .from('jobs')
      .insert(duplicateJobData)
      .select()
      .single()
  },

  // Soft delete job
  async softDeleteJob(jobId: string, userId: string) {
    const supabase = await createServerClient()
    
    // First verify ownership
    const isOwner = await this.validateOwnership(jobId, userId)
    if (!isOwner) {
      return { data: null, error: { message: 'Unauthorized' } }
    }
    
    return supabase
      .from('jobs')
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .eq('user_id', userId)
      .is('deleted_at', null) // Prevent double deletion
      .select()
      .single()
  },

  // Hard delete job (permanent deletion)
  async hardDeleteJob(jobId: string, userId: string) {
    const supabase = await createServerClient()
    
    // First verify ownership
    const isOwner = await this.validateOwnership(jobId, userId)
    if (!isOwner) {
      return { data: null, error: { message: 'Unauthorized' } }
    }
    
    return supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('user_id', userId)
  },

  // Restore soft-deleted job
  async restoreJob(jobId: string, userId: string) {
    const supabase = await createServerClient()
    
    // First verify ownership
    const isOwner = await this.validateOwnership(jobId, userId)
    if (!isOwner) {
      return { data: null, error: { message: 'Unauthorized' } }
    }
    
    return supabase
      .from('jobs')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .eq('user_id', userId)
      .not('deleted_at', 'is', null) // Only restore soft-deleted jobs
      .select()
      .single()
  },

  // Get user's deleted jobs
  async getUserDeletedJobs(userId: string) {
    const supabase = await createServerClient()
    
    return supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
  }
}