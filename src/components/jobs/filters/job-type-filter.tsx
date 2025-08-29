'use client'

interface JobTypeFilterProps {
  selectedTypes: ('Full-Time' | 'Part-Time' | 'Contract')[]
  onTypeChange: (types: ('Full-Time' | 'Part-Time' | 'Contract')[]) => void
}

const JOB_TYPES: ('Full-Time' | 'Part-Time' | 'Contract')[] = ['Full-Time', 'Part-Time', 'Contract']

const getJobTypeBadgeStyles = (jobType: string) => {
  switch (jobType) {
    case 'Full-Time':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Part-Time':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Contract':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function JobTypeFilter({ selectedTypes, onTypeChange }: JobTypeFilterProps) {
  const toggleType = (jobType: ('Full-Time' | 'Part-Time' | 'Contract')) => {
    if (selectedTypes.includes(jobType)) {
      onTypeChange(selectedTypes.filter(type => type !== jobType))
    } else {
      onTypeChange([...selectedTypes, jobType])
    }
  }

  const removeType = (jobType: ('Full-Time' | 'Part-Time' | 'Contract')) => {
    onTypeChange(selectedTypes.filter(type => type !== jobType))
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {JOB_TYPES.map((jobType) => (
          <label key={jobType} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTypes.includes(jobType)}
              onChange={() => toggleType(jobType)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-900">{jobType}</span>
          </label>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          {selectedTypes.map((jobType) => (
            <span
              key={jobType}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getJobTypeBadgeStyles(jobType)}`}
            >
              {jobType}
              <button
                type="button"
                onClick={() => removeType(jobType)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none"
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