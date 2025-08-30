'use client'

import { useState } from 'react'
import { Loader2, Sparkles, Check, X } from 'lucide-react'

interface AIDescriptionEnhancerProps {
  title: string
  company: string
  location: string
  jobType: string
  currentDescription?: string
  onDescriptionChange: (description: string) => void
  disabled?: boolean
}

export function AIDescriptionEnhancer({
  title,
  company,
  location,
  jobType,
  currentDescription = '',
  onDescriptionChange,
  disabled = false
}: AIDescriptionEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canEnhance = title && company && location && jobType && !disabled

  const handleEnhance = async () => {
    if (!canEnhance) return

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/enhance-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          jobType,
          existingDescription: currentDescription.trim() || undefined,
          enhancementType: currentDescription.trim() ? 'enhance' : 'generate'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance job description')
      }
      
      if (data.success && data.description) {
        setAiSuggestion(data.description)
        setShowPreview(true)
      } else {
        throw new Error('No description generated')
      }
    } catch (error) {
      console.error('AI enhancement failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to enhance job description')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = () => {
    if (aiSuggestion) {
      onDescriptionChange(aiSuggestion)
      setShowPreview(false)
      setAiSuggestion(null)
      setError(null)
    }
  }

  const handleReject = () => {
    setShowPreview(false)
    setAiSuggestion(null)
    setError(null)
  }

  const enhancementType = currentDescription.trim() ? 'enhance' : 'generate'

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={!canEnhance || isLoading}
          className={`
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border
            transition-colors duration-200
            ${!canEnhance || isLoading
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isLoading 
            ? 'Generating...' 
            : enhancementType === 'enhance' 
              ? 'Enhance with AI' 
              : 'Generate with AI'
          }
        </button>
        
        {!canEnhance && !disabled && (
          <p className="text-sm text-gray-500 mt-2">
            Fill in title, company, location, and job type to use AI enhancement
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && aiSuggestion && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generated Description
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Check className="h-3 w-3" />
                Accept
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                Reject
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div className="whitespace-pre-wrap text-gray-800 bg-white p-4 rounded border text-sm leading-relaxed">
              {aiSuggestion}
            </div>
          </div>
          
          <p className="text-xs text-blue-700 mt-2">
            Review the generated content and make any necessary adjustments before accepting.
          </p>
        </div>
      )}
    </div>
  )
}