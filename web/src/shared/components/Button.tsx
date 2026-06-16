import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary border-primary hover:bg-primary-container',
  secondary:
    'bg-surface-container-lowest text-primary border-outline-variant hover:bg-surface-container',
  danger: 'bg-error text-on-error border-error hover:bg-on-error-container',
  ghost: 'bg-transparent text-primary border-transparent hover:bg-surface-container',
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex min-h-9 items-center justify-center gap-2 rounded-default border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
