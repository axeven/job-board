import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'neutral'
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
          
          // Sizes
          {
            'h-3 w-3': size === 'xs',
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg',
            'h-12 w-12': size === 'xl',
          },
          
          // Colors
          {
            'text-primary-600': color === 'primary',
            'text-white': color === 'white',
            'text-neutral-600': color === 'neutral',
          },
          
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

// Loading skeleton component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: boolean
  animate?: boolean
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = true, animate = true, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-neutral-200',
          animate && 'animate-pulse',
          rounded && 'rounded-base',
          className
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Loading dots component
interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'neutral'
}

export const LoadingDots = forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex space-x-1', className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              'rounded-full animate-bounce',
              
              // Sizes
              {
                'h-1 w-1': size === 'sm',
                'h-1.5 w-1.5': size === 'md',
                'h-2 w-2': size === 'lg',
              },
              
              // Colors
              {
                'bg-primary-600': color === 'primary',
                'bg-white': color === 'white',
                'bg-neutral-600': color === 'neutral',
              }
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

LoadingDots.displayName = 'LoadingDots'

// Full page loading overlay
interface LoadingOverlayProps {
  visible: boolean
  message?: string
  variant?: 'spinner' | 'dots'
}

export const LoadingOverlay = ({ visible, message, variant = 'spinner' }: LoadingOverlayProps) => {
  if (!visible) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {variant === 'spinner' ? (
          <Spinner size="lg" />
        ) : (
          <LoadingDots size="lg" />
        )}
        
        {message && (
          <p className="text-sm font-medium text-neutral-600">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// Page loading component for route transitions
interface PageLoadingProps {
  message?: string
}

export const PageLoading = ({ message = 'Loading page...' }: PageLoadingProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-neutral-600">
          {message}
        </p>
      </div>
    </div>
  )
}

// Card loading skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-neutral-200 rounded-base p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton height={20} width="75%" />
        <Skeleton height={16} width="50%" />
      </div>
      
      <div className="space-y-2">
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="80%" />
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <Skeleton height={24} width={80} />
        <Skeleton height={32} width={100} />
      </div>
    </div>
  )
}

// List loading skeleton
export const ListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="60%" />
            <Skeleton height={14} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}