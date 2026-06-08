import { createContext, useContext } from 'react'

export type BadgeVariant =
  | 'default'
  | 'tag'
  | 'priority-low'
  | 'priority-medium'
  | 'priority-high'
  | 'status-backlog'
  | 'status-in-progress'
  | 'status-done'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export interface BadgeContextValue {
  variant: BadgeVariant
}

export const BadgeContext = createContext<BadgeContextValue | null>(null)

export function useBadgeContext(component: string): BadgeContextValue {
  const context = useContext(BadgeContext)
  if (!context) {
    throw new Error(`${component} must be used within Badge`)
  }
  return context
}

export const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-sunken text-text-secondary',
  tag: 'border border-border bg-surface text-text-secondary',
  'priority-low': 'bg-priority-low-subtle text-priority-low-foreground',
  'priority-medium': 'bg-priority-medium-subtle text-priority-medium-foreground',
  'priority-high': 'bg-priority-high-subtle text-priority-high-foreground',
  'status-backlog': 'bg-status-backlog-subtle text-status-backlog-foreground',
  'status-in-progress': 'bg-status-in-progress-subtle text-status-in-progress-foreground',
  'status-done': 'bg-status-done-subtle text-status-done-foreground',
  success: 'bg-success-subtle text-success-foreground',
  warning: 'bg-warning-subtle text-warning-foreground',
  error: 'bg-error-subtle text-error-foreground',
  info: 'bg-info-subtle text-info-foreground',
}
