export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}