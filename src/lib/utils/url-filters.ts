interface JobFilters {
  location: string[]
  jobType: ('Full-Time' | 'Part-Time' | 'Contract')[]
  searchQuery: string
}

export function filtersToUrlParams(filters: JobFilters): URLSearchParams {
  const params = new URLSearchParams()
  
  if (filters.location.length > 0) {
    params.set('location', filters.location.join(','))
  }
  
  if (filters.jobType.length > 0) {
    params.set('jobType', filters.jobType.join(','))
  }
  
  if (filters.searchQuery) {
    params.set('search', filters.searchQuery)
  }
  
  return params
}

export function urlParamsToFilters(searchParams: URLSearchParams): JobFilters {
  return {
    location: searchParams.get('location')?.split(',').filter(Boolean) || [],
    jobType: (searchParams.get('jobType')?.split(',').filter(Boolean) as JobFilters['jobType']) || [],
    searchQuery: searchParams.get('search') || ''
  }
}