import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/lib/variants'
import { LoaderPinwheel } from 'lucide-react'

// Define the valid color types
type ColorType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'info'

// Define the valid variant types
type VariantType = ColorType | `light-${ColorType}` | `dark-${ColorType}` | `outline-${ColorType}` | `ghost-${ColorType}` | `link-${ColorType}` | `soft-${ColorType}`

// Define the valid size types
type SizeType = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType
  size?: SizeType
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      fullWidth = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          'cursor-pointer',
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          loading && 'relative !text-transparent transition-none hover:!text-transparent',
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderPinwheel className="h-6 w-6 animate-spin duration-1000 text-slate-50" />
          </div>
        )}
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button }

Button.displayName = 'Button' 