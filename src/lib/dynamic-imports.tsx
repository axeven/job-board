import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

// Loading components for better UX during code splitting
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
)

export const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
  </div>
)

export const LoadingButton = () => (
  <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
)

export const LoadingForm = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-32 bg-gray-200 rounded w-full"></div>
    <div className="h-10 bg-gray-200 rounded w-32"></div>
  </div>
)

// Dynamic imports for heavy components
export const DynamicJobCreationForm = dynamic(
  () => import('@/components/jobs/job-creation-form').then(mod => ({ default: mod.JobCreationForm })),
  {
    loading: () => <LoadingForm />,
  }
)

export const DynamicJobEditForm = dynamic(
  () => import('@/components/jobs/job-edit-form').then(mod => ({ default: mod.JobEditForm })),
  {
    loading: () => <LoadingForm />,
  }
)

// export const DynamicRichTextEditor = dynamic(
//   () => import('@/components/ui/rich-text-editor').then(mod => ({ default: mod.RichTextEditor })),
//   {
//     loading: () => (
//       <div className="h-48 bg-gray-100 animate-pulse rounded border">
//         <div className="h-10 bg-gray-200 border-b"></div>
//         <div className="p-4">
//           <div className="h-4 bg-gray-200 rounded mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         </div>
//       </div>
//     ),
//     ssr: false,
//   }
// )

export const DynamicJobFilters = dynamic(
  () => import('@/components/jobs/filters/job-filters').then(mod => ({ default: mod.JobFiltersComponent })),
  {
    loading: () => (
      <div className="flex gap-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    ),
  }
)

// Dashboard components that are only loaded when needed (commented out until implemented)
// export const DynamicDashboardCharts = dynamic(
//   () => import('@/components/dashboard/charts').then(mod => ({ default: mod.DashboardCharts })),
//   {
//     loading: () => (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[1, 2, 3, 4].map(i => (
//           <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
//         ))}
//       </div>
//     ),
//     ssr: false,
//   }
// )

// export const DynamicExportTools = dynamic(
//   () => import('@/components/dashboard/export-tools').then(mod => ({ default: mod.ExportTools })),
//   {
//     loading: () => <LoadingCard />,
//     ssr: false,
//   }
// )

// Modal components - often heavy and not needed until user action (commented out until implemented)
// export const DynamicJobModal = dynamic(
//   () => import('@/components/jobs/job-modal').then(mod => ({ default: mod.JobModal })),
//   {
//     loading: () => (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-lg animate-pulse">
//           <div className="h-6 bg-gray-200 rounded mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         </div>
//       </div>
//     ),
//     ssr: false,
//   }
// )

// export const DynamicConfirmationModal = dynamic(
//   () => import('@/components/ui/confirmation-modal').then(mod => ({ default: mod.ConfirmationModal })),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// )

// Third-party library dynamic loading functions (commented out until packages are installed)
// export const loadChartLibrary = async () => {
//   try {
//     const [
//       { Chart, registerables },
//       ChartDataLabels
//     ] = await Promise.all([
//       import('chart.js'),
//       import('chartjs-plugin-datalabels')
//     ])
    
//     Chart.register(...registerables, ChartDataLabels)
//     return Chart
//   } catch (error) {
//     console.error('Failed to load chart library:', error)
//     throw error
//   }
// }

// export const loadDateLibrary = async () => {
//   try {
//     const dateFns = await import('date-fns')
//     return dateFns
//   } catch (error) {
//     console.error('Failed to load date library:', error)
//     throw error
//   }
// }

// export const loadMarkdownProcessor = async () => {
//   try {
//     const { remark } = await import('remark')
//     const remarkHtml = await import('remark-html')
//     return { remark, remarkHtml }
//   } catch (error) {
//     console.error('Failed to load markdown processor:', error)
//     throw error
//   }
// }

// Utility function to create dynamic component with custom loading
export function createDynamicComponent<T extends ComponentType<Record<string, unknown>>>(
  importFunction: () => Promise<{ default: T } | T>,
  options: {
    loading?: ComponentType
    ssr?: boolean
    loadingProps?: Record<string, unknown>
  } = {}
) {
  const { 
    loading = LoadingSpinner, 
    ssr = true, 
    loadingProps = {} 
  } = options

  return dynamic(
    async () => {
      const mod = await importFunction()
      // Handle both default and named exports
      return 'default' in mod ? mod : { default: mod as T }
    },
    {
      loading: () => React.createElement(loading, loadingProps),
      ssr,
    }
  )
}

