import { createContext } from 'react'

export type ToastVariant = 'success' | 'warning' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
}

export interface ToastContextValue {
  toast: (message: string, options?: Omit<ToastItem, 'id' | 'message'>) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export const DEFAULT_TOAST_DURATION = 4000

export const toastVariantClasses: Record<ToastVariant, string> = {
  success: 'border-success/30 bg-success-subtle text-success-foreground',
  warning: 'border-warning/30 bg-warning-subtle text-warning-foreground',
  error: 'border-error/30 bg-error-subtle text-error-foreground',
  info: 'border-info/30 bg-info-subtle text-info-foreground',
}
