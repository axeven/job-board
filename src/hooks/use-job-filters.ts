'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { filtersToUrlParams, urlParamsToFilters } from '@/lib/utils/url-filters'

export interface JobFilters {
  location: string[]
  jobType: ('Full-Time' | 'Part-Time' | 'Contract')[]
  searchQuery: string
}

export function useJobFilters(initialFilters?: JobFilters) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<JobFilters>(() => {
    if (initialFilters) {
      return initialFilters
    }
    return urlParamsToFilters(searchParams)
  })

  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    const params = filtersToUrlParams(updatedFilters)
    const queryString = params.toString()
    const newUrl = queryString ? `/jobs?${queryString}` : '/jobs'
    
    router.push(newUrl, { scroll: false })
  }, [filters, router])

  const resetFilters = useCallback(() => {
    const emptyFilters: JobFilters = {
      location: [],
      jobType: [],
      searchQuery: ''
    }
    setFilters(emptyFilters)
    router.push('/jobs', { scroll: false })
  }, [router])

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