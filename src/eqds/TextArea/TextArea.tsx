import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@eqds-utils'
import { TextAreaContext, useTextAreaContext } from './text-area-context'

export interface TextAreaProps {
  children: ReactNode
  error?: string
  required?: boolean
  disabled?: boolean
  id?: string
  wrapperClassName?: string
}

export function TextArea({
  children,
  error,
  required,
  disabled,
  id,
  wrapperClassName,
}: TextAreaProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const [hasHint, setHasHint] = useState(false)

  return (
    <TextAreaContext.Provider
      value={{
        inputId,
        errorId,
        hintId,
        error,
        required,
        disabled,
        hasHint,
        setHasHint,
      }}
    >
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>{children}</div>
    </TextAreaContext.Provider>
  )
}

export function TextAreaLabel({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { wrapperClassName?: string }) {
  const { inputId, required } = useTextAreaContext('TextAreaLabel')

  return (
    <label
      htmlFor={inputId}
      className={cn('text-label font-medium text-text-primary', wrapperClassName)}
      {...props}
    >
      {children}
      {required ? <span className="text-error"> *</span> : null}
    </label>
  )
}

export function TextAreaHint({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { hintId, setHasHint } = useTextAreaContext('TextAreaHint')

  useEffect(() => {
    setHasHint(true)
    return () => setHasHint(false)
  }, [setHasHint])

  return (
    <p id={hintId} className={cn('text-label text-text-muted', wrapperClassName)} {...props}>
      {children}
    </p>
  )
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>
>(function TextAreaField({ className, required, disabled, rows = 4, ...props }, ref) {
  const {
    inputId,
    errorId,
    hintId,
    error,
    hasHint,
    required: ctxRequired,
    disabled: ctxDisabled,
  } = useTextAreaContext('TextAreaField')

  const describedBy =
    [hasHint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <textarea
      ref={ref}
      id={inputId}
      rows={rows}
      required={required ?? ctxRequired}
      disabled={disabled ?? ctxDisabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        'w-full resize-y rounded-control border bg-surface px-3 py-2 text-body text-text-primary',
        'placeholder:text-text-muted',
        'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        error ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    />
  )
})

export function TextAreaError({
  wrapperClassName,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { errorId, error } = useTextAreaContext('TextAreaError')

  if (!error) return null

  return (
    <p
      id={errorId}
      role="alert"
      className={cn('text-label text-error-foreground', wrapperClassName)}
      {...props}
    >
      {error}
    </p>
  )
}
