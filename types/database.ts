import { Database } from './supabase'

// Job-related types
export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']
export type JobType = Database['public']['Enums']['job_type_enum']

// API response types
export type JobsResponse = {
  data: Job[] | null
  error: string | null
}

export type JobResponse = {
  data: Job | null
  error: string | null
}