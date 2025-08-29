'use client'

import { useState } from 'react'
import { JobFilters } from '@/hooks/use-job-filters'
import { SearchFilter } from './search-filter'
import { LocationFilter } from './location-filter'
import { JobTypeFilter } from './job-type-filter'

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: Partial<JobFilters>) => void
  availableLocations: string[]
  activeFilterCount: number
  onReset: () => void
}

export function JobFiltersComponent({ 
  filters, 
  onFiltersChange, 
  availableLocations, 
  activeFilterCount,
  onReset 
}: JobFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center justify-between py-4 space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <SearchFilter 
              query={filters.searchQuery}
              onQueryChange={(searchQuery) => onFiltersChange({ searchQuery })}
            />
            
            <div className="w-48">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location
              </label>
              <LocationFilter
                selectedLocations={filters.location}
                availableLocations={availableLocations}
                onLocationChange={(location) => onFiltersChange({ location })}
              />
            </div>
            
            <div className="w-44">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <JobTypeFilter
                selectedTypes={filters.jobType}
                onTypeChange={(jobType) => onFiltersChange({ jobType })}
              />
            </div>
          </div>
          
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Reset ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-3">
            <SearchFilter 
              query={filters.searchQuery}
              onQueryChange={(searchQuery) => onFiltersChange({ searchQuery })}
            />
            
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {isMobileFiltersOpen && (
            <div className="border-t border-gray-200 py-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Location</h3>
                <LocationFilter
                  selectedLocations={filters.location}
                  availableLocations={availableLocations}
                  onLocationChange={(location) => onFiltersChange({ location })}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Job Type</h3>
                <JobTypeFilter
                  selectedTypes={filters.jobType}
                  onTypeChange={(jobType) => onFiltersChange({ jobType })}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsMobileFiltersOpen(false)
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
                
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      onReset()
                      setIsMobileFiltersOpen(false)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {filters.searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: &quot;{filters.searchQuery}&quot;
                  <button
                    onClick={() => onFiltersChange({ searchQuery: '' })}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.location.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {location}
                  <button
                    onClick={() => onFiltersChange({ location: filters.location.filter(l => l !== location) })}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              
              {filters.jobType.map((jobType) => (
                <span
                  key={jobType}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {jobType}
                  <button
                    onClick={() => onFiltersChange({ jobType: filters.jobType.filter(t => t !== jobType) })}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200 focus:outline-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}