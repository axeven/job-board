import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string()
    .min(3, 'Job title must be at least 3 characters')
    .max(100, 'Job title must be less than 100 characters')
    .trim(),
  
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(50, 'Job description must be at least 50 characters')
    .max(5000, 'Job description must be less than 5000 characters')
    .trim(),
  
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .trim(),
  
  job_type: z.enum(['Full-Time', 'Part-Time', 'Contract'], {
    required_error: 'Please select a job type'
  })
})

export type JobFormData = z.infer<typeof jobSchema>

// Create job input interface for database operations
export interface CreateJobInput {
  title: string
  company: string
  description: string
  location: string
  job_type: 'Full-Time' | 'Part-Time' | 'Contract'
  user_id: string
}