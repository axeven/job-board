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
        className="relative w-full bg-white border border-neutral-300 rounded-base pl-3.5 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-neutral-400 transition-colors duration-base text-sm"
      >
        <span className={`block truncate ${selectedLocations.length === 0 ? 'text-neutral-500' : 'text-neutral-900'}`}>
          {selectedLocations.length === 0 
            ? 'Location' 
            : `${selectedLocations.length} location${selectedLocations.length === 1 ? '' : 's'}`
          }
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className={`h-4 w-4 text-neutral-600 transition-transform duration-base ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-base py-1 border border-neutral-200 overflow-auto focus:outline-none text-sm">
          {availableLocations.length === 0 ? (
            <div className="px-3 py-2 text-neutral-500">No locations available</div>
          ) : (
            availableLocations.map((location) => {
              const isSelected = selectedLocations.includes(location)
              return (
                <label
                  key={location}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-neutral-50 focus-within:bg-neutral-50 transition-colors duration-base flex items-center"
                  onClick={() => toggleLocation(location)}
                >
                  <div className={`flex-shrink-0 w-4 h-4 mr-3 border rounded-xs transition-colors duration-base ${
                    isSelected 
                      ? 'bg-primary-600 border-primary-600' 
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}>
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
                  <span className="text-neutral-900">{location}</span>
                </label>
              )
            })
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