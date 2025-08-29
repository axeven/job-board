'use client'

import { useState, useRef, useEffect } from 'react'

interface LocationFilterProps {
  selectedLocations: string[]
  availableLocations: string[]
  onLocationChange: (locations: string[]) => void
}

export function LocationFilter({ 
  selectedLocations, 
  availableLocations, 
  onLocationChange 
}: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationChange(selectedLocations.filter(l => l !== location))
    } else {
      onLocationChange([...selectedLocations, location])
    }
  }

  const removeLocation = (location: string) => {
    onLocationChange(selectedLocations.filter(l => l !== location))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <span className="block truncate">
          {selectedLocations.length === 0 
            ? 'All Locations' 
            : `${selectedLocations.length} location${selectedLocations.length === 1 ? '' : 's'} selected`
          }
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {availableLocations.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No locations available</div>
          ) : (
            availableLocations.map((location) => (
              <div
                key={location}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                onClick={() => toggleLocation(location)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => {}} // Controlled by onClick above
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 block text-gray-900">{location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedLocations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLocations.map((location) => (
            <span
              key={location}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {location}
              <button
                type="button"
                onClick={() => removeLocation(location)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}