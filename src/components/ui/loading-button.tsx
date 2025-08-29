import { forwardRef } from 'react'
import { Button } from './button'
import { Spinner } from './loading'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
  loadingSpinner?: boolean
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    isLoading = false, 
    loadingText, 
    loadingSpinner = true,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    return (
      <Button 
        ref={ref}
        disabled={isLoading || disabled} 
        {...props}
      >
        {isLoading && loadingSpinner && (
          <Spinner size="sm" color="white" className="mr-2" />
        )}
        {isLoading ? (loadingText || 'Loading...') : children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'