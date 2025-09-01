import type { ApplicationStatus, TimelineConfig, TimelineStep } from '@/types/timeline'

export function generateTimeline(
  currentStatus: ApplicationStatus,
  appliedAt: string,
  updatedAt: string
): TimelineConfig {
  const steps = generateTimelineSteps(currentStatus)
  const nextAction = getNextActionMessage(currentStatus)
  
  return {
    steps,
    currentStatus,
    appliedAt,
    updatedAt,
    nextAction
  }
}

export function generateTimelineSteps(currentStatus: ApplicationStatus): TimelineStep[] {
  const baseSteps: Omit<TimelineStep, 'isCompleted' | 'isCurrent' | 'icon'>[] = [
    {
      id: 'applied',
      status: 'pending',
      label: 'Applied',
      description: 'Your application has been submitted'
    },
    {
      id: 'reviewing',
      status: 'reviewing', 
      label: 'Under Review',
      description: 'Application is being reviewed'
    },
    {
      id: 'shortlisted',
      status: 'shortlisted',
      label: 'Shortlisted',
      description: 'Selected for next round'
    },
    {
      id: 'final',
      status: currentStatus === 'accepted' ? 'accepted' : 
               currentStatus === 'rejected' ? 'rejected' : 'pending',
      label: 'Final Decision',
      description: 'Application outcome decided'
    }
  ]

  // Handle different status flows
  if (currentStatus === 'rejected') {
    // For rejections, show where rejection occurred
    return baseSteps.map((step, index) => {
      const stepStatus = getStepStatusFromIndex(index, currentStatus)
      return {
        ...step,
        ...stepStatus,
        // Override final step for rejection
        ...(step.id === 'final' && {
          status: 'rejected' as ApplicationStatus,
          label: 'Rejected',
          description: 'Application was not successful'
        })
      }
    })
  }

  if (currentStatus === 'accepted') {
    // For acceptance, mark final step as accepted
    return baseSteps.map((step, index) => {
      const stepStatus = getStepStatusFromIndex(index, currentStatus)
      return {
        ...step,
        ...stepStatus,
        // Override final step for acceptance
        ...(step.id === 'final' && {
          status: 'accepted' as ApplicationStatus,
          label: 'Accepted',
          description: 'Congratulations! Application accepted'
        })
      }
    })
  }

  // Standard flow for pending, reviewing, shortlisted
  return baseSteps.map((step, index) => {
    const stepStatus = getStepStatusFromIndex(index, currentStatus)
    return {
      ...step,
      ...stepStatus
    }
  })
}

function getStepStatusFromIndex(
  stepIndex: number, 
  currentStatus: ApplicationStatus
): Pick<TimelineStep, 'isCompleted' | 'isCurrent' | 'icon'> {
  const statusOrder: ApplicationStatus[] = ['pending', 'reviewing', 'shortlisted', 'accepted']
  const currentIndex = statusOrder.indexOf(currentStatus)
  
  // Handle rejection - can happen at any stage
  if (currentStatus === 'rejected') {
    if (stepIndex === 0) {
      return { isCompleted: true, isCurrent: false, icon: 'check' }
    } else if (stepIndex === 3) { // Final step
      return { isCompleted: true, isCurrent: false, icon: 'rejected' }
    } else {
      // Middle steps - show as completed up to where rejection likely occurred
      const isCompleted = stepIndex <= 1 // Assume rejection happened during or after review
      return { 
        isCompleted, 
        isCurrent: false, 
        icon: isCompleted ? 'check' : 'pending' 
      }
    }
  }
  
  // Normal progression
  if (stepIndex < currentIndex) {
    return { isCompleted: true, isCurrent: false, icon: 'check' }
  } else if (stepIndex === currentIndex) {
    return { isCompleted: false, isCurrent: true, icon: 'current' }
  } else {
    return { isCompleted: false, isCurrent: false, icon: 'pending' }
  }
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