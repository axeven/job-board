import type { ApplicationStatus, TimelineStep } from '@/types/timeline'

export interface StatusFlow {
  id: string
  name: string
  description: string
  steps: string[]
}

// Define different application flow patterns
export const statusFlows: Record<string, StatusFlow> = {
  standard: {
    id: 'standard',
    name: 'Standard Flow',
    description: 'Standard hiring process with all stages',
    steps: ['applied', 'reviewing', 'shortlisted', 'final']
  },
  
  express_rejection: {
    id: 'express_rejection',
    name: 'Express Rejection',
    description: 'Quick rejection after initial review',
    steps: ['applied', 'reviewing', 'rejected']
  },
  
  direct_shortlist: {
    id: 'direct_shortlist',
    name: 'Direct Shortlist',
    description: 'Fast-tracked to shortlist without extended review',
    steps: ['applied', 'shortlisted', 'final']
  },
  
  immediate_acceptance: {
    id: 'immediate_acceptance',
    name: 'Immediate Acceptance',
    description: 'Direct acceptance without multiple rounds',
    steps: ['applied', 'accepted']
  }
}

// Map application statuses to appropriate flow patterns
export function getStatusFlow(currentStatus: ApplicationStatus): StatusFlow {
  switch (currentStatus) {
    case 'rejected':
      // For rejections, determine if it was express or after shortlisting
      // For now, default to express rejection - could be enhanced with more data
      return statusFlows.express_rejection
    
    case 'accepted':
      // For acceptances, determine if it was immediate or after full process
      // This could be enhanced by checking how long the process took
      return statusFlows.standard
    
    case 'shortlisted':
      // Currently shortlisted, using standard flow
      return statusFlows.standard
    
    case 'reviewing':
    case 'pending':
    default:
      // Default to standard flow for active applications
      return statusFlows.standard
  }
}

// Generate step configurations based on status and flow
export function generateFlowSteps(
  currentStatus: ApplicationStatus,
  appliedAt: string,
  updatedAt: string,
  flow?: StatusFlow
): TimelineStep[] {
  const selectedFlow = flow || getStatusFlow(currentStatus)
  const steps: TimelineStep[] = []
  
  // Base step templates with concise descriptions
  const stepTemplates: Record<string, Omit<TimelineStep, 'isCompleted' | 'isCurrent' | 'icon' | 'timestamp'>> = {
    applied: {
      id: 'applied',
      status: 'pending',
      label: 'Applied',
      description: 'Submitted'
    },
    reviewing: {
      id: 'reviewing',
      status: 'reviewing',
      label: 'Under Review',
      description: 'In progress'
    },
    shortlisted: {
      id: 'shortlisted',
      status: 'shortlisted',
      label: 'Shortlisted',
      description: 'Next round'
    },
    final: {
      id: 'final',
      status: currentStatus === 'accepted' ? 'accepted' : 
               currentStatus === 'rejected' ? 'rejected' : 'pending',
      label: currentStatus === 'accepted' ? 'Accepted' :
              currentStatus === 'rejected' ? 'Rejected' : 'Final Decision',
      description: currentStatus === 'accepted' ? 'Offer made' :
                   currentStatus === 'rejected' ? 'Not selected' :
                   'Decision pending'
    },
    rejected: {
      id: 'rejected',
      status: 'rejected',
      label: 'Not Selected',
      description: 'Application closed'
    },
    accepted: {
      id: 'accepted',
      status: 'accepted',
      label: 'Offer Extended',
      description: 'Congratulations!'
    }
  }
  
  // Build steps based on selected flow
  selectedFlow.steps.forEach((stepId, index) => {
    const template = stepTemplates[stepId]
    if (!template) return
    
    const stepStatus = getStepStatus(stepId, currentStatus, index, selectedFlow.steps)
    
    steps.push({
      ...template,
      ...stepStatus,
      timestamp: getStepTimestamp(stepId, currentStatus, appliedAt, updatedAt, index)
    })
  })
  
  return steps
}

// Determine if a step is completed, current, or pending
function getStepStatus(
  stepId: string,
  currentStatus: ApplicationStatus,
  stepIndex: number,
  flowSteps: string[]
): Pick<TimelineStep, 'isCompleted' | 'isCurrent' | 'icon'> {
  const statusOrder: ApplicationStatus[] = ['pending', 'reviewing', 'shortlisted', 'accepted']
  const currentStatusIndex = statusOrder.indexOf(currentStatus)
  
  // Handle special cases first
  if (currentStatus === 'rejected') {
    if (stepId === 'applied') {
      return { isCompleted: true, isCurrent: false, icon: 'check' }
    } else if (stepId === 'rejected' || (stepId === 'final' && flowSteps.includes('final'))) {
      return { isCompleted: true, isCurrent: false, icon: 'rejected' }
    } else {
      // Intermediate steps for rejection flow
      const isCompleted = stepIndex < flowSteps.length - 1
      return { 
        isCompleted, 
        isCurrent: false, 
        icon: isCompleted ? 'check' : 'pending' 
      }
    }
  }
  
  if (currentStatus === 'accepted') {
    if (stepId === 'accepted' || (stepId === 'final' && flowSteps[flowSteps.length - 1] === 'final')) {
      return { isCompleted: true, isCurrent: false, icon: 'accepted' }
    } else {
      return { isCompleted: true, isCurrent: false, icon: 'check' }
    }
  }
  
  // Normal flow progression
  if (stepId === 'applied') {
    return { isCompleted: true, isCurrent: false, icon: 'check' }
  }
  
  // Map step IDs to status for comparison
  const stepStatusMap: Record<string, ApplicationStatus> = {
    reviewing: 'reviewing',
    shortlisted: 'shortlisted',
    final: 'accepted' // Final step represents the end state
  }
  
  const stepStatus = stepStatusMap[stepId]
  if (!stepStatus) {
    return { isCompleted: false, isCurrent: false, icon: 'pending' }
  }
  
  const stepStatusIndex = statusOrder.indexOf(stepStatus)
  
  if (stepStatusIndex < currentStatusIndex) {
    return { isCompleted: true, isCurrent: false, icon: 'check' }
  } else if (stepStatusIndex === currentStatusIndex || 
             (stepId === 'reviewing' && currentStatus === 'reviewing') ||
             (stepId === 'shortlisted' && currentStatus === 'shortlisted')) {
    return { isCompleted: false, isCurrent: true, icon: 'current' }
  } else {
    return { isCompleted: false, isCurrent: false, icon: 'pending' }
  }
}

// Generate appropriate timestamp for each step
function getStepTimestamp(
  stepId: string,
  currentStatus: ApplicationStatus,
  appliedAt: string,
  updatedAt: string,
  stepIndex: number
): string | undefined {
  if (stepId === 'applied') {
    return appliedAt
  }
  
  // For completed steps or current step, use updated timestamp
  if (stepIndex === 0 || 
      (stepId === 'reviewing' && ['reviewing', 'shortlisted', 'accepted', 'rejected'].includes(currentStatus)) ||
      (stepId === 'shortlisted' && ['shortlisted', 'accepted', 'rejected'].includes(currentStatus)) ||
      (stepId === 'final' && ['accepted', 'rejected'].includes(currentStatus)) ||
      (stepId === 'rejected' && currentStatus === 'rejected') ||
      (stepId === 'accepted' && currentStatus === 'accepted')) {
    return updatedAt
  }
  
  return undefined
}

// Get user-friendly status flow description
export function getFlowDescription(status: ApplicationStatus): string {
  const flow = getStatusFlow(status)
  
  const descriptions: Record<string, string> = {
    standard: "Your application is following the standard hiring process with multiple review stages.",
    express_rejection: "Your application was reviewed and a decision was made quickly.",
    direct_shortlist: "Great news! Your application was fast-tracked to the shortlist stage.",
    immediate_acceptance: "Excellent! Your application resulted in an immediate job offer."
  }
  
  return descriptions[flow.id] || descriptions.standard
}

// Estimate completion percentage based on current status and flow
export function getFlowProgress(status: ApplicationStatus): {
  percentage: number
  completedSteps: number
  totalSteps: number
} {
  const flow = getStatusFlow(status)
  const totalSteps = flow.steps.length
  
  let completedSteps = 0
  
  switch (status) {
    case 'pending':
      completedSteps = 1 // Applied
      break
    case 'reviewing':
      completedSteps = 2 // Applied + Reviewing
      break
    case 'shortlisted':
      completedSteps = flow.steps.includes('reviewing') ? 3 : 2 // Applied + (Reviewing) + Shortlisted
      break
    case 'accepted':
    case 'rejected':
      completedSteps = totalSteps // All steps completed
      break
  }
  
  const percentage = Math.round((completedSteps / totalSteps) * 100)
  
  return {
    percentage,
    completedSteps,
    totalSteps
  }
}