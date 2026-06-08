import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@eqds-utils'
import { TextInputContext, useTextInputContext } from './text-input-context'

export interface TextInputProps {
  children: ReactNode
  error?: string
  required?: boolean
  disabled?: boolean
  id?: string
  wrapperClassName?: string
}

export function TextInput({
  children,
  error,
  required,
  disabled,
  id,
  wrapperClassName,
}: TextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const [hasHint, setHasHint] = useState(false)

  return (
    <TextInputContext.Provider
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
    </TextInputContext.Provider>
  )
}

export function TextInputLabel({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { wrapperClassName?: string }) {
  const { inputId, required } = useTextInputContext('TextInputLabel')

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

export function TextInputHint({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { hintId, setHasHint } = useTextInputContext('TextInputHint')

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

export const TextInputField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>
>(function TextInputField({ className, required, disabled, ...props }, ref) {
  const {
    inputId,
    errorId,
    hintId,
    error,
    hasHint,
    required: ctxRequired,
    disabled: ctxDisabled,
  } = useTextInputContext('TextInputField')

  const describedBy =
    [hasHint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <input
      ref={ref}
      id={inputId}
      required={required ?? ctxRequired}
      disabled={disabled ?? ctxDisabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        'w-full rounded-control border bg-surface px-3 py-2 text-body text-text-primary',
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

export function TextInputError({
  wrapperClassName,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { errorId, error } = useTextInputContext('TextInputError')

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
