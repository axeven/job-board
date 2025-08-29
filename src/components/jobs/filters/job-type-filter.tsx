'use client'

import { MultiSelect } from '@/components/ui'

interface JobTypeFilterProps {
  selectedTypes: ('Full-Time' | 'Part-Time' | 'Contract')[]
  onTypeChange: (types: ('Full-Time' | 'Part-Time' | 'Contract')[]) => void
}

const JOB_TYPE_OPTIONS = [
  { value: 'Full-Time', label: 'Full-Time' },
  { value: 'Part-Time', label: 'Part-Time' },
  { value: 'Contract', label: 'Contract' }
]

export function JobTypeFilter({ selectedTypes, onTypeChange }: JobTypeFilterProps) {
  const handleChange = (value: string[]) => {
    onTypeChange(value as ('Full-Time' | 'Part-Time' | 'Contract')[])
  }

  return (
    <MultiSelect
      options={JOB_TYPE_OPTIONS}
      value={selectedTypes}
      onChange={handleChange}
      placeholder="Job Type"
    />
  )
}