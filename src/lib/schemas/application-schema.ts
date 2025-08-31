import { z } from 'zod'

export const applicationSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  cover_letter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must be less than 2000 characters'),
  resume_file_path: z
    .string()
    .optional() // File path from Supabase storage
})

export const applicationStatusUpdateSchema = z.object({
  application_id: z.string().uuid('Invalid application ID'),
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
})

export const userProfileSchema = z.object({
  user_type: z.enum(['employer', 'job_seeker']),
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  profile_data: z.record(z.any()).optional(),
  resume_file_path: z
    .string()
    .optional() // Supabase storage path
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
export type ApplicationStatusUpdate = z.infer<typeof applicationStatusUpdateSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>