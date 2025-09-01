'use client'

import { useRef, useState } from 'react'
import { Button } from './button'
import { X, Upload, FileText, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
  className?: string
  disabled?: boolean
  error?: string
}

export function FileUpload({
  accept = '.pdf,.doc,.docx',
  maxSize = 2 * 1024 * 1024, // 2MB
  onFileSelect,
  selectedFile,
  className = '',
  disabled = false,
  error
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [internalError, setInternalError] = useState<string>('')

  // Use external error if provided, otherwise use internal error
  const displayError = error || internalError

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
    }

    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setInternalError(validationError)
      return
    }
    
    setInternalError('')
    onFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    onFileSelect(null)
    setInternalError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // If file is selected, show file info
  if (selectedFile) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {displayError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{displayError}</span>
          </div>
        )}
      </div>
    )
  }

  // Show upload area
  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${disabled 
            ? 'bg-muted/25 cursor-not-allowed opacity-50' 
            : dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/50' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <Upload className={`h-8 w-8 mx-auto mb-3 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
        <div className="space-y-2">
          <p className={`text-sm ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
            {disabled ? (
              'File upload is disabled'
            ) : (
              <>
                Drag and drop your resume here, or{' '}
                <span className="text-blue-600 hover:text-blue-700 underline font-medium">
                  browse files
                </span>
              </>
            )}
          </p>
          {!disabled && (
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX up to {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {displayError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  )
}