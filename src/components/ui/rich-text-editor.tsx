'use client'

import { useState, useCallback, useRef } from 'react'
import { clsx } from 'clsx'
import { AIDescriptionEnhancer } from '@/components/jobs/ai-description-enhancer'
import { AIErrorBoundary } from '@/components/jobs/ai-error-boundary'

interface RichTextEditorProps {
  name: string
  label: string
  placeholder?: string
  error?: string[]
  required?: boolean
  maxLength?: number
  defaultValue?: string
  className?: string
  enableAIEnhancement?: boolean
  jobContext?: {
    title: string
    company: string
    location: string
    jobType: string
  }
}

export function RichTextEditor({
  name,
  label,
  placeholder = 'Enter job description...',
  error,
  required,
  maxLength = 5000,
  defaultValue = '',
  className,
  enableAIEnhancement = false,
  jobContext
}: RichTextEditorProps) {
  const [content, setContent] = useState(defaultValue)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= maxLength) {
      setContent(newContent)
    }
  }, [maxLength])
  
  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end)
    
    if (newContent.length <= maxLength) {
      setContent(newContent)
      
      // Restore selection
      setTimeout(() => {
        textarea.focus()
        const newPos = start + before.length + selectedText.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    }
  }, [content, maxLength])
  
  const formatContent = (text: string) => {
    // First handle line breaks and paragraphs
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    
    // Handle bullet lists - convert lines starting with "- " to list items
    const lines = formatted.split('\n')
    let result = ''
    let inList = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isListItem = line.trim().startsWith('- ')
      
      if (isListItem) {
        if (!inList) {
          result += '<ul class="list-disc ml-4 space-y-1">'
          inList = true
        }
        result += `<li>${line.trim().substring(2)}</li>`
      } else {
        if (inList) {
          result += '</ul>'
          inList = false
        }
        if (line.trim()) {
          result += `<p class="mb-4">${line}</p>`
        } else if (i < lines.length - 1) {
          result += '<br>'
        }
      }
    }
    
    if (inList) {
      result += '</ul>'
    }
    
    return result
  }
  
  const characterCount = content.length
  const isOverLimit = characterCount > maxLength
  
  return (
    <div className={className}>
      {/* AI Enhancement Section */}
      {enableAIEnhancement && jobContext && (
        <div className="mb-4">
          <AIErrorBoundary>
            <AIDescriptionEnhancer
              title={jobContext.title || ''}
              company={jobContext.company || ''}
              location={jobContext.location || ''}
              jobType={jobContext.jobType || ''}
              currentDescription={content}
              onDescriptionChange={setContent}
              disabled={isPreviewMode}
            />
          </AIErrorBoundary>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <span className={clsx(
            "text-xs",
            isOverLimit ? "text-red-600" : "text-gray-500"
          )}>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>
      
      {!isPreviewMode && (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {/* Formatting Toolbar */}
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('`', '`')}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                title="Code"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ', '')}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Bullet List"
              >
                • List
              </button>
            </div>
          </div>
          
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            name={name}
            id={name}
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            required={required}
            className={clsx(
              "w-full px-3 py-3 border-0 resize-none focus:outline-none",
              "placeholder-gray-400 text-gray-900",
              error ? "text-red-900" : ""
            )}
            rows={12}
            style={{ minHeight: '200px' }}
          />
        </div>
      )}
      
      {isPreviewMode && (
        <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50">
          <div className="prose max-w-none text-sm">
            {content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatContent(content)
                }}
              />
            ) : (
              <p className="text-gray-400 italic">{placeholder}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Helper Text */}
      <div className="mt-2 text-xs text-gray-500">
        <p>
          You can use <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code>, and <strong>- bullet lists</strong>
        </p>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error[0]}
        </p>
      )}
    </div>
  )
}