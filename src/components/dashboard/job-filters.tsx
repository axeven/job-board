'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobStatus } from '@/lib/database/jobs'

interface JobFiltersProps {
  currentFilters: {
    status: 'all' | JobStatus
    sort: 'newest' | 'oldest' | 'most_views'
    search: string
  }
}

export function JobFilters({ currentFilters }: JobFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentFilters.search) {
        const params = new URLSearchParams(searchParams.toString())
        
        if (search === '') {
          params.delete('search')
        } else {
          params.set('search', search)
        }
        
        // Reset to page 1 when search changes
        params.delete('page')
        
        const newUrl = `?${params.toString()}`
        if (newUrl !== `?${searchParams.toString()}`) {
          router.push(newUrl)
        }
      }
    }, 500) // Increased debounce time

    return () => clearTimeout(timer)
  }, [search, currentFilters.search, searchParams, router])

  const updateFilters = useCallback((updates: Partial<typeof currentFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '' || value === 'newest') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`?${params.toString()}`)
  }, [searchParams, router])

  const clearFilters = () => {
    setSearch('')
    router.push('/dashboard/jobs')
  }

  const hasActiveFilters = 
    currentFilters.status !== 'all' || 
    currentFilters.sort !== 'newest' || 
    currentFilters.search !== ''

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <StatusTab
            label="All"
            count={null}
            active={currentFilters.status === 'all'}
            onClick={() => updateFilters({ status: 'all' })}
          />
          <StatusTab
            label="Active"
            count={null}
            active={currentFilters.status === 'active'}
            onClick={() => updateFilters({ status: 'active' })}
            color="green"
          />
          <StatusTab
            label="Draft"
            count={null}
            active={currentFilters.status === 'draft'}
            onClick={() => updateFilters({ status: 'draft' })}
            color="yellow"
          />
          <StatusTab
            label="Closed"
            count={null}
            active={currentFilters.status === 'closed'}
            onClick={() => updateFilters({ status: 'closed' })}
            color="gray"
          />
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={currentFilters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value as 'newest' | 'oldest' | 'most_views' })}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="most_views">Most views</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {currentFilters.status !== 'all' && (
              <FilterTag
                label={`Status: ${currentFilters.status}`}
                onRemove={() => updateFilters({ status: 'all' })}
              />
            )}
            
            {currentFilters.sort !== 'newest' && (
              <FilterTag
                label={`Sort: ${getSortLabel(currentFilters.sort)}`}
                onRemove={() => updateFilters({ sort: 'newest' })}
              />
            )}
            
            {currentFilters.search && (
              <FilterTag
                label={`Search: "${currentFilters.search}"`}
                onRemove={() => setSearch('')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface StatusTabProps {
  label: string
  count: number | null
  active: boolean
  onClick: () => void
  color?: 'green' | 'yellow' | 'gray'
}

function StatusTab({ label, count, active, onClick, color }: StatusTabProps) {
  const getTabClasses = () => {
    const baseClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    
    if (active) {
      switch (color) {
        case 'green':
          return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
        case 'yellow':
          return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
        case 'gray':
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
        default:
          return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      }
    }
    
    return `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent`
  }

  return (
    <button onClick={onClick} className={getTabClasses()}>
      {label}
      {count !== null && (
        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-50">
          {count}
        </span>
      )}
    </button>
  )
}

interface FilterTagProps {
  label: string
  onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
      {label}
      <button
        onClick={onRemove}
        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:bg-blue-200"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </span>
  )
}

function getSortLabel(sort: string): string {
  switch (sort) {
    case 'oldest':
      return 'Oldest first'
    case 'most_views':
      return 'Most views'
    default:
      return 'Newest first'
  }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}