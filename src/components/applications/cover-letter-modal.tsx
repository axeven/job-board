'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoverLetterModalProps {
  coverLetter: string
  jobTitle: string
  companyName: string
}

export function CoverLetterModal({ coverLetter, jobTitle, companyName }: CoverLetterModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!coverLetter || coverLetter.trim() === '') {
    return null // Don't show button if no cover letter
  }

  return (
    <>
      {/* Cover Letter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1 text-xs h-7 px-2"
        title="View your cover letter"
      >
        <FileText className="h-3 w-3" />
        Cover Letter
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <Card className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <p className="text-sm text-muted-foreground">
                  {jobTitle} at {companyName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Cover Letter Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {coverLetter}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

// Compact version for small spaces
export function CoverLetterButton({ 
  coverLetter, 
  jobTitle, 
  companyName, 
  className 
}: CoverLetterModalProps & { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!coverLetter || coverLetter.trim() === '') {
    return null
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn("gap-1 text-xs h-7 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50", className)}
        title="View cover letter"
      >
        <FileText className="h-3 w-3" />
        Cover Letter
      </Button>

      {/* Inline Modal (same as above) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
          />
          
          <Card className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <p className="text-sm text-muted-foreground">
                  {jobTitle} at {companyName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {coverLetter}
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}