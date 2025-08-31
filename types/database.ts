import { Database } from './supabase'

// Job-related types
export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']
export type JobType = Database['public']['Enums']['job_type_enum']

// User profile types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type ExperienceLevel = Database['public']['Enums']['experience_level_enum']

// Job application types
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']
export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']
export type ApplicationStatus = Database['public']['Enums']['application_status_enum']

// Extended types for joined queries
export type JobApplicationWithJob = JobApplication & {
  jobs: {
    id: string
    title: string
    company: string
    location: string
    job_type: JobType
  }
}

export type JobApplicationWithProfile = JobApplication & {
  user_profiles: UserProfile
}

// API response types
export type JobsResponse = {
  data: Job[] | null
  error: string | null
}

export type JobResponse = {
  data: Job | null
  error: string | null
}