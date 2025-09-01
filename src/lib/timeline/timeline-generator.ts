import type { ApplicationStatus, TimelineConfig, TimelineStep } from '@/types/timeline'
import { generateFlowSteps, getFlowDescription, getFlowProgress } from './status-mapping'

export function generateTimeline(
  currentStatus: ApplicationStatus,
  appliedAt: string,
  updatedAt: string
): TimelineConfig {
  const steps = generateFlowSteps(currentStatus, appliedAt, updatedAt)
  const nextAction = getNextActionMessage(currentStatus)
  
  return {
    steps,
    currentStatus,
    appliedAt,
    updatedAt,
    nextAction
  }
}

// Enhanced timeline generation with flow information
export function generateEnhancedTimeline(
  currentStatus: ApplicationStatus,
  appliedAt: string,
  updatedAt: string,
  includeMetadata: boolean = false
): TimelineConfig & {
  flowDescription?: string
  progress?: { percentage: number; completedSteps: number; totalSteps: number }
} {
  const timeline = generateTimeline(currentStatus, appliedAt, updatedAt)
  
  if (includeMetadata) {
    return {
      ...timeline,
      flowDescription: getFlowDescription(currentStatus),
      progress: getFlowProgress(currentStatus)
    }
  }
  
  return timeline
}

// Legacy function - kept for backward compatibility but now uses new flow system
export function generateTimelineSteps(currentStatus: ApplicationStatus): TimelineStep[] {
  // Use the new flow-based system
  return generateFlowSteps(currentStatus, new Date().toISOString(), new Date().toISOString())
}

export function getNextActionMessage(status: ApplicationStatus): string {
  const nextActionMessages: Record<ApplicationStatus, string> = {
    pending: "Your application will be reviewed within 2-3 business days.",
    reviewing: "We'll contact you within 1-2 business days with an update.",
    shortlisted: "Expect to hear from us soon regarding next steps.",
    accepted: "Check your email for further instructions.",
    rejected: "Feel free to apply for other positions that match your skills."
  }
  
  return nextActionMessages[status]
}

export function getStatusDescription(status: ApplicationStatus): string {
  const statusDescriptions: Record<ApplicationStatus, string> = {
    pending: "Your application has been received and is queued for review.",
    reviewing: "Our team is currently reviewing your application and qualifications.",
    shortlisted: "Congratulations! You've been shortlisted for the next round.",
    accepted: "Congratulations! Your application has been accepted.",
    rejected: "Thank you for your interest. We've decided to move forward with other candidates."
  }
  
  return statusDescriptions[status]
}