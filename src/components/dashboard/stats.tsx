import { UserStats } from '@/lib/database/dashboard'

interface DashboardStatsProps {
  stats: UserStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total Jobs',
      value: stats.totalJobs,
      description: 'Jobs you&apos;ve posted',
      icon: BriefcaseIcon,
      color: 'blue'
    },
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      description: 'Currently accepting applications',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'Total Views',
      value: stats.totalViews,
      description: 'Views across all jobs',
      icon: EyeIcon,
      color: 'purple'
    },
    {
      name: 'This Month',
      value: stats.jobsThisMonth,
      description: 'Jobs posted this month',
      icon: CalendarIcon,
      color: 'orange'
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className={`h-8 w-8 ${getIconColor(item.color)}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function getIconColor(color: string) {
  switch (color) {
    case 'blue':
      return 'text-blue-500'
    case 'green':
      return 'text-green-500'
    case 'purple':
      return 'text-purple-500'
    case 'orange':
      return 'text-orange-500'
    default:
      return 'text-gray-400'
  }
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2H8V6" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}