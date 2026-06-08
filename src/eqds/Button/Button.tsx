import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react'
import { cn } from '@eqds-utils'
import {
  ButtonContext,
  useButtonContext,
  type ButtonSize,
  type ButtonVariant,
} from './button-context'

export type { ButtonSize, ButtonVariant }

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  wrapperClassName?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover disabled:bg-primary/50',
  secondary:
    'border border-secondary-border bg-secondary text-secondary-foreground hover:bg-secondary-hover disabled:bg-secondary/50',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive-hover disabled:bg-destructive/50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-label',
  md: 'px-4 py-2 text-body',
  lg: 'px-5 py-2.5 text-body-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    wrapperClassName,
    type = 'button',
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <ButtonContext.Provider value={{ variant, size, disabled }}>
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          wrapperClassName,
        )}
        {...props}
      >
        {children}
      </button>
    </ButtonContext.Provider>
  )
})

export function ButtonLabel({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { wrapperClassName?: string }) {
  useButtonContext('ButtonLabel')

  return (
    <span className={cn(wrapperClassName)} {...props}>
      {children}
    </span>
  )
}

export function ButtonIcon({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { wrapperClassName?: string }) {
  useButtonContext('ButtonIcon')

  return (
    <span aria-hidden="true" className={cn('inline-flex shrink-0', wrapperClassName)} {...props}>
      {children}
    </span>
  )
}
