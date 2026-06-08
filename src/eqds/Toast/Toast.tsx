import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@eqds-utils'
import {
  DEFAULT_TOAST_DURATION,
  ToastContext,
  toastVariantClasses,
  type ToastItem,
} from './toast-context'

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = toast.duration ?? DEFAULT_TOAST_DURATION
    if (duration <= 0) return

    timerRef.current = window.setTimeout(() => onDismiss(toast.id), duration)
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [onDismiss, toast.duration, toast.id])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-control border px-4 py-3 text-body shadow-overlay',
        toastVariantClasses[toast.variant ?? 'info'],
      )}
    >
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="rounded-control px-1 text-current/70 hover:text-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, options?: Omit<ToastItem, 'id' | 'message'>) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, message, ...options }])
      return id
    },
    [],
  )

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-label="Notifications"
          className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full  flex-col gap-2"
        >
          {toasts.map((item) => (
            <ToastMessage key={item.id} toast={item} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
