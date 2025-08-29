'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, value, onChange, placeholder = 'Select options...', className, disabled = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close on escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen])

    const handleToggleOption = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue))
      } else {
        onChange([...value, optionValue])
      }
    }

    const getDisplayText = () => {
      if (value.length === 0) return placeholder
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0])
        return option?.label || value[0]
      }
      return `${value.length} selected`
    }

    return (
      <div 
        ref={containerRef}
        className={clsx('relative', className)}
      >
        <button
          ref={ref}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-base',
            'flex items-center justify-between',
            'transition-colors duration-base',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            disabled ? 
              'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 
              'text-neutral-900 hover:border-neutral-400 cursor-pointer'
          )}
        >
          <span className={value.length === 0 ? 'text-neutral-500' : 'text-neutral-900'}>
            {getDisplayText()}
          </span>
          
          <svg
            className={clsx(
              'w-4 h-4 transition-transform duration-base',
              isOpen && 'transform rotate-180',
              disabled ? 'text-neutral-400' : 'text-neutral-600'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-base shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className={clsx(
                      'flex items-center px-3 py-2 cursor-pointer transition-colors duration-base',
                      'hover:bg-neutral-50 focus-within:bg-neutral-50'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleOption(option.value)}
                      className="sr-only"
                    />
                    
                    <div className={clsx(
                      'flex-shrink-0 w-4 h-4 mr-3 border rounded-xs transition-colors duration-base',
                      isSelected 
                        ? 'bg-primary-600 border-primary-600' 
                        : 'border-neutral-300 bg-white hover:border-neutral-400'
                    )}>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    
                    <span className="text-sm text-neutral-900">
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'