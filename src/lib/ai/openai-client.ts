import OpenAI from 'openai'
import { env } from '@/lib/env'

// Only initialize OpenAI if API key is available
export const openai = env.OPENAI_API_KEY ? new OpenAI({
  apiKey: env.OPENAI_API_KEY,
}) : null

export interface JobDescriptionPrompt {
  title: string
  company: string
  location: string
  jobType: string
  existingDescription?: string
  enhancementType: 'generate' | 'enhance'
}

export interface AIServiceResponse {
  success: boolean
  description?: string
  error?: string
}

export class AIServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AIServiceError'
  }
}

/**
 * Check if AI features are enabled and properly configured
 */
export function isAIEnabled(): boolean {
  return env.AI_FEATURES_ENABLED && !!env.OPENAI_API_KEY
}

/**
 * Validate that required job data is present for AI enhancement
 */
export function validateJobData(data: Partial<JobDescriptionPrompt>): boolean {
  return !!(data.title && data.company && data.location && data.jobType)
}