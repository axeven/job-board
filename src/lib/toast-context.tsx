'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer } from '@/components/ui/toast-container'
import type { ToastProps } from '@/components/ui/toast'

interface Toast extends Omit<ToastProps, 'onClose'> {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const toastProps: ToastProps[] = toasts.map(toast => ({
    ...toast,
    onClose: removeToast,
  }))

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toastProps} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return {
    toast: {
      success: (title: string, description?: string, duration?: number) =>
        context.addToast({ type: 'success', title, description, duration }),
      error: (title: string, description?: string, duration?: number) =>
        context.addToast({ type: 'error', title, description, duration }),
      warning: (title: string, description?: string, duration?: number) =>
        context.addToast({ type: 'warning', title, description, duration }),
      info: (title: string, description?: string, duration?: number) =>
        context.addToast({ type: 'info', title, description, duration }),
    },
    clearToasts: context.clearToasts,
  }
}