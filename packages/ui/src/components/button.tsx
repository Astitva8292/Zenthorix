import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
          variant === 'primary'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : variant === 'secondary'
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              : 'hover:bg-accent hover:text-accent-foreground'
        } ${
          size === 'sm' ? 'h-8 px-3 text-xs' : size === 'md' ? 'h-9 px-4 text-sm' : 'h-10 px-5 text-base'
        } ${className}`}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
