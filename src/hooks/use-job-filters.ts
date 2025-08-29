'use client'

import { useState, useCallback } from 'react'

export interface JobFilters {
  location: string[]
  jobType: ('Full-Time' | 'Part-Time' | 'Contract')[]
  searchQuery: string
}

export function useJobFilters(initialFilters?: JobFilters) {
  const [filters, setFilters] = useState<JobFilters>(() => {
    return initialFilters || {
      location: [],
      jobType: [],
      searchQuery: ''
    }
  })

  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
  }, [filters])

  const resetFilters = useCallback(() => {
    const emptyFilters: JobFilters = {
      location: [],
      jobType: [],
      searchQuery: ''
    }
    setFilters(emptyFilters)
  }, [])

  const hasActiveFilters = filters.location.length > 0 || 
                          filters.jobType.length > 0 || 
                          filters.searchQuery.length > 0

  const activeFilterCount = filters.location.length + 
                           filters.jobType.length + 
                           (filters.searchQuery ? 1 : 0)

  return { 
    filters, 
    updateFilters, 
    resetFilters, 
    hasActiveFilters,
    activeFilterCount
  }
}