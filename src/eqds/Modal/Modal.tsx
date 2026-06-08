import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@eqds-utils'
import { getFocusableElements, trapFocus } from '../utils/focus-trap'
import { ModalContext, useModalContext } from './modal-context'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  autoFocus?: boolean
  initialFocusRef?: React.RefObject<HTMLElement | null>
  wrapperClassName?: string
}

interface ModalSectionProps extends HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string
  children: ReactNode
}

export function Modal({
  open,
  onClose,
  children,
  autoFocus = true,
  initialFocusRef,
  wrapperClassName,
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [hasDescription, setHasDescription] = useState(false)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const frame = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
        return
      }
      if (!autoFocus || !dialogRef.current) return
      const focusable = getFocusableElements(dialogRef.current)
      focusable[0]?.focus()
    })

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [autoFocus, initialFocusRef, open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (dialogRef.current) trapFocus(dialogRef.current, event)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <ModalContext.Provider
      value={{ titleId, descriptionId, dialogRef, setHasDescription }}
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
        onMouseDown={handleOverlayClick}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          className={cn(
            'w-full max-w-sm rounded-modal border border-border bg-surface-overlay shadow-overlay',
            wrapperClassName,
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  )
}

export function ModalHeader({ wrapperClassName, children, ...props }: ModalSectionProps) {
  useModalContext('ModalHeader')

  return (
    <div
      className={cn('border-b border-border px-6 py-4', wrapperClassName)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalTitle({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { wrapperClassName?: string }) {
  const { titleId } = useModalContext('ModalTitle')

  return (
    <h2
      id={titleId}
      className={cn(
        'text-title font-semibold leading-heading text-text-primary',
        wrapperClassName,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function ModalDescription({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { descriptionId, setHasDescription } = useModalContext('ModalDescription')

  useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <p
      id={descriptionId}
      className={cn('mt-1 text-body text-text-secondary', wrapperClassName)}
      {...props}
    >
      {children}
    </p>
  )
}

export function ModalBody({ wrapperClassName, children, ...props }: ModalSectionProps) {
  useModalContext('ModalBody')

  return (
    <div className={cn('px-6 py-4', wrapperClassName)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ wrapperClassName, children, ...props }: ModalSectionProps) {
  useModalContext('ModalFooter')

  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border px-6 py-4',
        wrapperClassName,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
