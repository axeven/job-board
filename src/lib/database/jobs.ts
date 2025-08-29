import { supabase } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { JobInsert, JobUpdate, JobType } from '@/types/database'

interface JobFilters {
  location: string[]
  jobType: ('Full-Time' | 'Part-Time' | 'Contract')[]
  searchQuery: string
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
      .order('created_at', { ascending: false })
  },

  // Get filtered jobs (new implementation)
  async getFiltered(filters: JobFilters) {
    const client = supabase()
    let query = client
      .from('jobs')
      .select('*')
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
      .order('created_at', { ascending: false })
  },

  // Get filtered jobs (new implementation)
  async getFiltered(filters: JobFilters) {
    const supabase = await createServerClient()
    let query = supabase
      .from('jobs')
      .select('*')
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
      .not('location', 'is', null)
      .not('location', 'eq', '')
  }
}