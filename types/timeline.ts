export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'

export interface TimelineStep {
  id: string
  status: ApplicationStatus
  label: string
  description: string
  timestamp?: string
  isCompleted: boolean
  isCurrent: boolean
  icon: 'check' | 'current' | 'pending' | 'rejected' | 'accepted'
}

export interface TimelineConfig {
  steps: TimelineStep[]
  currentStatus: ApplicationStatus
  appliedAt: string
  updatedAt: string
  nextAction?: string
}

export interface TimelineState {
  isExpanded: boolean
  animationState: 'idle' | 'expanding' | 'collapsing'
  currentStep: number
  totalSteps: number
}