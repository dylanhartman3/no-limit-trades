import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', style, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    const styles =
      variant === 'secondary'
        ? 'border border-white/20 bg-white/10 hover:bg-white/20 text-white'
        : 'bg-[#6C2BD9] text-white hover:opacity-90'
    return (
      <button ref={ref} style={style} className={`${base} ${styles} ${className}`} {...props} />
    )
  }
)

Button.displayName = 'Button'
