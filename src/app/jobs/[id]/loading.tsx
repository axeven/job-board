export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header section */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                {/* Job title skeleton */}
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 lg:h-10"></div>
                {/* Company name skeleton */}
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                {/* Badges skeleton */}
                <div className="flex gap-3">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                  <div className="h-6 bg-gray-300 rounded w-28"></div>
                </div>
              </div>
              {/* Share button skeleton */}
              <div className="mt-6 lg:mt-0 lg:ml-6">
                <div className="h-10 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div className="mb-8">
            {/* Section title skeleton */}
            <div className="h-7 bg-gray-300 rounded w-48 mb-6"></div>
            {/* Content lines skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            
            {/* Job details section skeleton */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-32"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-28"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-36"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions section skeleton */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="h-12 bg-gray-300 rounded flex-1 sm:flex-none sm:w-32"></div>
              <div className="h-12 bg-gray-300 rounded w-24"></div>
              <div className="h-12 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-28"></div>
            </div>
          </div>
          
          {/* Navigation section skeleton */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="h-5 bg-gray-300 rounded w-24"></div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                  <div className="h-4 bg-gray-300 rounded w-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-10"></div>
                  <div className="h-4 bg-gray-300 rounded w-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}