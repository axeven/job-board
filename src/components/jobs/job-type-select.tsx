'use client'

import { clsx } from 'clsx'

interface JobTypeSelectProps {
  name: string
  error?: string[]
  defaultValue?: string
  className?: string
}

export function JobTypeSelect({ name, error, defaultValue, className }: JobTypeSelectProps) {
  const jobTypes = [
    { value: 'Full-Time', label: 'Full-Time', icon: '🏢', description: 'Standard full-time position' },
    { value: 'Part-Time', label: 'Part-Time', icon: '⏰', description: 'Part-time or flexible hours' },
    { value: 'Contract', label: 'Contract', icon: '📄', description: 'Contract or freelance work' }
  ]
  
  return (
    <fieldset className={className}>
      <legend className="block text-sm font-medium text-gray-700 mb-3">
        Job Type <span className="text-red-500">*</span>
      </legend>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {jobTypes.map((type) => (
          <label key={type.value} className="relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={type.value}
              defaultChecked={defaultValue === type.value}
              className="sr-only peer"
              required
            />
            <div className={clsx(
              'p-4 border rounded-lg transition-all duration-200',
              'hover:border-gray-400 hover:bg-gray-50',
              'peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2',
              error ? 'border-red-300' : 'border-gray-300'
            )}>
              <div className="text-center">
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {type.label}
                </div>
                <div className="text-xs text-gray-500">
                  {type.description}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error[0]}
        </p>
      )}
    </fieldset>
  )
}