import { formatDistanceToNow, format as formatDate, isValid } from 'date-fns'
import type { ApplicationStatus, TimelineStep } from '@/types/timeline'

export function validateStatusProgression(
  fromStatus: ApplicationStatus,
  toStatus: ApplicationStatus
): boolean {
  const progressionRules: Record<ApplicationStatus, ApplicationStatus[]> = {
    pending: ['reviewing', 'rejected'],
    reviewing: ['shortlisted', 'rejected', 'accepted'],
    shortlisted: ['accepted', 'rejected'],
    accepted: [], // Terminal state
    rejected: []  // Terminal state
  }
  
  return progressionRules[fromStatus]?.includes(toStatus) ?? false
}

export function formatTimelineTimestamp(
  date: string | Date,
  format: 'relative' | 'absolute' | 'both' | 'smart' = 'relative'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  switch (format) {
    case 'relative':
      return formatDistanceToNow(dateObj, { addSuffix: true })
    case 'absolute':
      return formatDate(dateObj, 'MMM d, yyyy')
    case 'both':
      return `${formatDistanceToNow(dateObj, { addSuffix: true })} (${formatDate(dateObj, 'MMM d')})`
    case 'smart':
      // Smart formatting based on how recent the date is
      const daysDiff = Math.abs(new Date().getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff < 1) {
        return formatDistanceToNow(dateObj, { addSuffix: true })
      } else if (daysDiff < 7) {
        return `${Math.floor(daysDiff)} day${Math.floor(daysDiff) === 1 ? '' : 's'} ago`
      } else {
        return formatDate(dateObj, 'MMM d')
      }
    default:
      return formatDistanceToNow(dateObj, { addSuffix: true })
  }
}

export function calculateTimelineProgress(steps: TimelineStep[]): {
  completed: number
  total: number
  percentage: number
} {
  const completed = steps.filter(step => step.isCompleted).length
  const total = steps.length
  const percentage = Math.round((completed / total) * 100)
  
  return { completed, total, percentage }
}

export function getTimelineDuration(appliedAt: string, updatedAt?: string): {
  totalDays: number
  formattedDuration: string
} {
  const startDate = new Date(appliedAt)
  const endDate = updatedAt ? new Date(updatedAt) : new Date()
  
  if (!isValid(startDate) || !isValid(endDate)) {
    return { totalDays: 0, formattedDuration: 'Unknown' }
  }
  
  const diffMs = endDate.getTime() - startDate.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  const formattedDuration = totalDays === 0 
    ? 'Today' 
    : totalDays === 1 
    ? '1 day'
    : `${totalDays} days`
  
  return { totalDays, formattedDuration }
}

export function getAnimationDelay(stepIndex: number): number {
  // Stagger animation delays for smooth timeline rendering
  const baseDelay = 100 // ms
  const maxDelay = 500 // ms
  
  return Math.min(stepIndex * baseDelay, maxDelay)
}

export function getTimelineStepColor(
  step: TimelineStep,
  theme: 'light' | 'dark' = 'light'
): {
  background: string
  border: string
  text: string
} {
  const colors = {
    light: {
      completed: {
        background: 'bg-emerald-500',
        border: 'border-emerald-500',
        text: 'text-white'
      },
      current: {
        background: 'bg-blue-500',
        border: 'border-blue-500 ring-2 ring-blue-200',
        text: 'text-white'
      },
      pending: {
        background: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-500'
      },
      rejected: {
        background: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-white'
      },
      accepted: {
        background: 'bg-emerald-500',
        border: 'border-emerald-500',
        text: 'text-white'
      }
    },
    dark: {
      completed: {
        background: 'bg-emerald-600',
        border: 'border-emerald-600',
        text: 'text-white'
      },
      current: {
        background: 'bg-blue-600',
        border: 'border-blue-600 ring-2 ring-blue-300',
        text: 'text-white'
      },
      pending: {
        background: 'bg-gray-700',
        border: 'border-gray-600',
        text: 'text-gray-300'
      },
      rejected: {
        background: 'bg-red-600',
        border: 'border-red-600',
        text: 'text-white'
      },
      accepted: {
        background: 'bg-emerald-600',
        border: 'border-emerald-600',
        text: 'text-white'
      }
    }
  }
  
  const themeColors = colors[theme]
  const iconColors = themeColors[step.icon as keyof typeof themeColors]
  return iconColors || themeColors.pending
}

export function isTimelineComplete(steps: TimelineStep[]): boolean {
  return steps.every(step => step.isCompleted) &&
         steps.some(step => step.icon === 'accepted' || step.icon === 'rejected')
}

export function getNextExpectedStep(
  currentStatus: ApplicationStatus
): ApplicationStatus | null {
  const nextSteps: Record<ApplicationStatus, ApplicationStatus | null> = {
    pending: 'reviewing',
    reviewing: 'shortlisted',
    shortlisted: 'accepted',
    accepted: null,
    rejected: null
  }
  
  return nextSteps[currentStatus]
}

export function estimateTimeToNextStep(
  currentStatus: ApplicationStatus,
  appliedAt?: string
): {
  estimatedDays: number
  message: string
  isOverdue?: boolean
} {
  const estimations: Record<ApplicationStatus, { days: number; message: string }> = {
    pending: {
      days: 3,
      message: "Applications are typically reviewed within 2-3 business days"
    },
    reviewing: {
      days: 5,
      message: "Review process usually takes 3-5 business days"
    },
    shortlisted: {
      days: 7,
      message: "Next steps are usually communicated within a week"
    },
    accepted: {
      days: 0,
      message: "Congratulations! Check your email for next steps"
    },
    rejected: {
      days: 0,
      message: "Thank you for your interest. Consider applying to other positions"
    }
  }
  
  const estimation = estimations[currentStatus]
  let isOverdue = false
  
  // Check if timeline is overdue based on applied date
  if (appliedAt && estimation.days > 0) {
    const daysSinceApplied = Math.floor(
      (new Date().getTime() - new Date(appliedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    isOverdue = daysSinceApplied > estimation.days
  }
  
  return {
    estimatedDays: estimation.days,
    message: estimation.message,
    isOverdue
  }
}

// Get user-friendly status messages with context
export function getStatusMessage(
  status: ApplicationStatus,
  appliedAt: string,
  updatedAt: string
): {
  primary: string
  secondary: string
  tone: 'positive' | 'neutral' | 'negative' | 'warning'
} {
  const daysSinceApplied = Math.floor(
    (new Date().getTime() - new Date(appliedAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  switch (status) {
    case 'pending':
      return {
        primary: "Application Submitted",
        secondary: `Applied ${daysSinceApplied} day${daysSinceApplied === 1 ? '' : 's'} ago. Review typically begins within 2-3 business days.`,
        tone: daysSinceApplied > 5 ? 'warning' : 'neutral'
      }
    
    case 'reviewing':
      return {
        primary: "Under Review",
        secondary: `Your application is being actively reviewed. Updates typically come within 3-5 business days.`,
        tone: daysSinceUpdate > 7 ? 'warning' : 'positive'
      }
    
    case 'shortlisted':
      return {
        primary: "Shortlisted!",
        secondary: "Great news! You've been selected for the next round. Expect to hear about next steps soon.",
        tone: 'positive'
      }
    
    case 'accepted':
      return {
        primary: "Congratulations!",
        secondary: "Your application has been accepted. Check your email for offer details and next steps.",
        tone: 'positive'
      }
    
    case 'rejected':
      return {
        primary: "Application Unsuccessful",
        secondary: "Thank you for your interest. We encourage you to apply for other positions that match your skills.",
        tone: 'negative'
      }
    
    default:
      return {
        primary: "Application Status",
        secondary: "Your application is in the system.",
        tone: 'neutral'
      }
  }
}

// Get helpful action suggestions based on status
export function getActionSuggestions(
  status: ApplicationStatus,
  daysSinceUpdate: number = 0
): string[] {
  switch (status) {
    case 'pending':
      const suggestions = ["Be patient - initial review takes time"]
      if (daysSinceUpdate > 7) {
        suggestions.push("Consider following up with the employer")
      }
      return suggestions
    
    case 'reviewing':
      return [
        "Keep checking your email for updates",
        "Prepare for potential next steps",
        daysSinceUpdate > 10 ? "Consider a polite follow-up" : "Stay patient - review is in progress"
      ].filter(Boolean)
    
    case 'shortlisted':
      return [
        "Check your email regularly",
        "Prepare for interviews or assessments",
        "Research the company further"
      ]
    
    case 'accepted':
      return [
        "Check your email for offer details",
        "Prepare for contract negotiation",
        "Celebrate this achievement!"
      ]
    
    case 'rejected':
      return [
        "Browse other job opportunities",
        "Consider requesting feedback",
        "Update your application materials"
      ]
    
    default:
      return ["Monitor your application status regularly"]
  }
}