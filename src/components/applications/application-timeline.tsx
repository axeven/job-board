'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TimelineConfig, TimelineStep, TimelineState } from '@/types/timeline'

interface ApplicationTimelineProps {
  jobTitle: string
  companyName: string
  location: string
  timeline: TimelineConfig
  className?: string
  additionalActions?: React.ReactNode
}

export function ApplicationTimeline({ 
  jobTitle, 
  companyName, 
  location, 
  timeline,
  className,
  additionalActions
}: ApplicationTimelineProps) {
  const [state, setState] = useState<TimelineState>({
    isExpanded: false,
    animationState: 'idle',
    currentStep: timeline.steps.findIndex(step => step.isCurrent),
    totalSteps: timeline.steps.length
  })

  const toggleExpansion = () => {
    setState(prev => ({
      ...prev,
      isExpanded: !prev.isExpanded,
      animationState: !prev.isExpanded ? 'expanding' : 'collapsing'
    }))
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <TimelineHeader 
        jobTitle={jobTitle}
        companyName={companyName}
        location={location}
        timeline={timeline}
        isExpanded={state.isExpanded}
        onToggle={toggleExpansion}
        additionalActions={additionalActions}
      />

      {/* Timeline Steps - Collapsible */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        state.isExpanded 
          ? "max-h-96 opacity-100" 
          : "max-h-0 opacity-0 md:max-h-24 md:opacity-100"
      )}>
        <div className="p-6 pt-0">
          <TimelineSteps steps={timeline.steps} />
        </div>
      </div>

      {/* Footer */}
      {state.isExpanded && (
        <TimelineFooter 
          timeline={timeline}
        />
      )}
    </Card>
  )
}

function TimelineHeader({ 
  jobTitle, 
  companyName, 
  location, 
  timeline, 
  isExpanded, 
  onToggle,
  additionalActions
}: {
  jobTitle: string
  companyName: string
  location: string
  timeline: TimelineConfig
  isExpanded: boolean
  onToggle: () => void
  additionalActions?: React.ReactNode
}) {
  const currentStep = timeline.steps.find(step => step.isCurrent)
  
  return (
    <div className="p-6 pb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{jobTitle}</h3>
          <p className="text-muted-foreground text-sm">
            {companyName} • {location}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">
              {currentStep?.label || timeline.currentStatus}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {/* Additional Actions */}
          {additionalActions}
          
          {/* Mobile Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="md:hidden"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Timeline
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Timeline
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Desktop: Always show compact timeline */}
      <div className="hidden md:block mt-4">
        <CompactTimelineSteps steps={timeline.steps} />
      </div>
    </div>
  )
}

function TimelineSteps({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-6 md:space-y-0 md:flex md:items-center md:justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex md:flex-col md:items-center md:flex-1">
          <TimelineStepDesktop step={step} />
          {index < steps.length - 1 && (
            <TimelineConnector 
              fromStep={step} 
              toStep={steps[index + 1]} 
              className="hidden md:block"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function CompactTimelineSteps({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <TimelineStepIcon step={step} size="sm" />
          {index < steps.length - 1 && (
            <TimelineConnector 
              fromStep={step} 
              toStep={steps[index + 1]} 
              compact
            />
          )}
        </div>
      ))}
    </div>
  )
}

function TimelineStepDesktop({ step }: { step: TimelineStep }) {
  return (
    <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
      <TimelineStepIcon step={step} />
      <div className="space-y-1 md:mt-2">
        <h4 className="font-medium text-sm">{step.label}</h4>
        <p className="text-xs text-muted-foreground">
          {step.description}
        </p>
        {step.timestamp && (
          <p className="text-xs text-muted-foreground">
            {step.timestamp}
          </p>
        )}
      </div>
    </div>
  )
}

function TimelineStepIcon({ 
  step, 
  size = 'default' 
}: { 
  step: TimelineStep
  size?: 'sm' | 'default' 
}) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  
  const getIconAndStyles = () => {
    switch (step.icon) {
      case 'check':
        return {
          icon: <Check className={iconSize} />,
          bg: 'bg-emerald-500',
          text: 'text-white',
          border: 'border-emerald-500'
        }
      case 'current':
        return {
          icon: <Clock className={iconSize} />,
          bg: 'bg-blue-500',
          text: 'text-white',
          border: 'border-blue-500 ring-2 ring-blue-200 ring-offset-2'
        }
      case 'rejected':
        return {
          icon: <X className={iconSize} />,
          bg: 'bg-red-500',
          text: 'text-white',
          border: 'border-red-500'
        }
      case 'accepted':
        return {
          icon: <Check className={iconSize} />,
          bg: 'bg-emerald-500 animate-pulse',
          text: 'text-white',
          border: 'border-emerald-500'
        }
      default: // pending
        return {
          icon: <div className={cn("rounded-full bg-current", size === 'sm' ? 'w-2 h-2' : 'w-3 h-3')} />,
          bg: 'bg-gray-100',
          text: 'text-gray-500',
          border: 'border-gray-300'
        }
    }
  }
  
  const { icon, bg, text, border } = getIconAndStyles()
  
  return (
    <div className={cn(
      "rounded-full border-2 flex items-center justify-center",
      sizeClasses,
      bg,
      text,
      border
    )}>
      {icon}
    </div>
  )
}

function TimelineConnector({ 
  fromStep, 
  toStep, 
  compact = false,
  className 
}: { 
  fromStep: TimelineStep
  toStep: TimelineStep
  compact?: boolean
  className?: string
}) {
  const getLineStyles = () => {
    if (fromStep.isCompleted && toStep.isCompleted) {
      return 'bg-emerald-500'
    }
    if (fromStep.isCompleted && toStep.isCurrent) {
      return 'bg-gradient-to-r from-emerald-500 to-blue-500'
    }
    if (fromStep.icon === 'rejected' || toStep.icon === 'rejected') {
      return 'bg-red-500'
    }
    return 'bg-gray-300 border-dashed'
  }
  
  return (
    <div className={cn(
      "flex-1 mx-2",
      compact ? "h-0.5" : "h-1",
      getLineStyles(),
      className
    )} />
  )
}

function TimelineFooter({ timeline }: { timeline: TimelineConfig }) {
  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <div className="text-muted-foreground">
          Applied {new Date(timeline.appliedAt).toLocaleDateString()} • 
          Last updated {new Date(timeline.updatedAt).toLocaleDateString()}
        </div>
        {timeline.nextAction && (
          <div className="text-blue-600 font-medium">
            {timeline.nextAction}
          </div>
        )}
      </div>
    </div>
  )
}