import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@eqds-utils'
import {
  BadgeContext,
  badgeVariantClasses,
  useBadgeContext,
  type BadgeVariant,
} from './badge-context'

export type { BadgeVariant }

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: BadgeVariant
  children: ReactNode
  wrapperClassName?: string
}

export function Badge({
  variant = 'default',
  wrapperClassName,
  children,
  ...props
}: BadgeProps) {
  return (
    <BadgeContext.Provider value={{ variant }}>
      <span
        className={cn(
          'inline-flex items-center rounded-control px-2 py-0.5 text-label font-medium',
          badgeVariantClasses[variant],
          wrapperClassName,
        )}
        {...props}
      >
        {children}
      </span>
    </BadgeContext.Provider>
  )
}

export function BadgeLabel({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { wrapperClassName?: string }) {
  useBadgeContext('BadgeLabel')

  return (
    <span className={cn(wrapperClassName)} {...props}>
      {children}
    </span>
  )
}

/** Alias for task tag chips — same compound API as Badge. */
export const Tag = Badge
export const TagLabel = BadgeLabel
