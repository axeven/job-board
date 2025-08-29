import Image, { ImageProps } from 'next/image'
import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    fallbackSrc, 
    className, 
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    ...props 
  }, ref) => {
    const [imgSrc, setImgSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc)
        setHasError(false)
      } else {
        setHasError(true)
      }
      setIsLoading(false)
    }

    const handleLoadingComplete = () => {
      setIsLoading(false)
    }

    if (hasError) {
      return (
        <div 
          className={clsx(
            'bg-neutral-200 flex items-center justify-center text-neutral-500',
            className
          )}
          style={{ 
            width: props.width || '100%', 
            height: props.height || 'auto' 
          }}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )
    }

    return (
      <div className={clsx('relative', className)}>
        <Image
          ref={ref}
          src={imgSrc}
          alt={alt}
          sizes={sizes}
          onError={handleError}
          onLoad={handleLoadingComplete}
          className={clsx(
            'transition-opacity duration-300',
            isLoading && 'opacity-0'
          )}
          {...props}
        />
        {isLoading && (
          <div 
            className="absolute inset-0 bg-neutral-200 animate-pulse rounded"
            style={{ 
              width: props.width || '100%', 
              height: props.height || '100%' 
            }}
          />
        )}
      </div>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

// Company logo component with fallbacks
interface CompanyLogoProps {
  companyName: string
  logoUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function CompanyLogo({ 
  companyName, 
  logoUrl, 
  size = 'md',
  className 
}: CompanyLogoProps) {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 }
  }

  const dimensions = sizeMap[size]

  if (!logoUrl) {
    return <PlaceholderLogo companyName={companyName} size={size} className={className} />
  }

  return (
    <OptimizedImage
      src={logoUrl}
      alt={`${companyName} logo`}
      width={dimensions.width}
      height={dimensions.height}
      className={clsx('rounded-md object-contain', className)}
      priority={size === 'xl'} // Only prioritize large logos (likely hero images)
      fallbackSrc="/images/company-placeholder.svg"
    />
  )
}

// Placeholder logo when no logo URL is provided
interface PlaceholderLogoProps {
  companyName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

function PlaceholderLogo({ companyName, size = 'md', className }: PlaceholderLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  }

  // Get initials from company name
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  // Generate a consistent background color based on company name
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500'
  ]
  
  const colorIndex = companyName.length % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div 
      className={clsx(
        'flex items-center justify-center rounded-md text-white font-semibold',
        sizeMap[size],
        bgColor,
        className
      )}
      title={companyName}
    >
      {initials}
    </div>
  )
}