'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, Check } from 'lucide-react'

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  placeholder?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  disabled?: boolean
}>({
  isOpen: false,
  setIsOpen: () => {},
})

import React from 'react'

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <SelectContext.Provider value={{ 
        value, 
        onValueChange, 
        isOpen, 
        setIsOpen, 
        disabled 
      }}>
        <div ref={ref} className="relative" {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    )
  }
)

Select.displayName = 'Select'

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, setIsOpen, disabled } = React.useContext(SelectContext)
    const triggerRef = useRef<HTMLButtonElement>(null)

    React.useImperativeHandle(ref, () => triggerRef.current!)

    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'hover:bg-gray-50',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={clsx(
          'h-4 w-4 opacity-50 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
    )
  }
)

SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext)
    const contentRef = useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => contentRef.current!)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    return (
      <div
        ref={contentRef}
        className={clsx(
          'absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SelectContent.displayName = 'SelectContent'

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext)
    const isSelected = selectedValue === value

    const handleClick = () => {
      onValueChange?.(value)
      setIsOpen(false)
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={clsx(
          'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm',
          'hover:bg-gray-100 focus:bg-gray-100',
          'outline-none',
          isSelected && 'bg-gray-100',
          className
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {isSelected && (
          <Check className="h-4 w-4" />
        )}
      </div>
    )
  }
)

SelectItem.displayName = 'SelectItem'

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className, ...props }, ref) => {
    const { value } = React.useContext(SelectContext)

    return (
      <span 
        ref={ref} 
        className={clsx(className)}
        {...props}
      >
        {value || placeholder}
      </span>
    )
  }
)

SelectValue.displayName = 'SelectValue'