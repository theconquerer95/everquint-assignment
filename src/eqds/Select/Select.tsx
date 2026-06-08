import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@eqds-utils'
import {
  SelectContext,
  useSelectContext,
  type SelectOption,
} from './select-context'

export type { SelectOption }

export interface SelectProps<T extends string = string> {
  children: ReactNode
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  error?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  wrapperClassName?: string
}

export function Select<T extends string = string>({
  children,
  value,
  options,
  onChange,
  error,
  id,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  wrapperClassName,
}: SelectProps<T>) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const listboxId = `${selectId}-listbox`
  const errorId = `${selectId}-error`
  const hintId = `${selectId}-hint`

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hasHint, setHasHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
  }, [])

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      onChange(option.value)
      close()
    },
    [close, onChange, options],
  )

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [close, open])

  const selectedIndex = options.findIndex((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const index = selectedIndex >= 0 ? selectedIndex : 0
    setActiveIndex(index)
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' })
  }, [open, selectedIndex])

  return (
    <SelectContext.Provider
      value={{
        selectId,
        listboxId,
        errorId,
        hintId,
        value,
        options,
        onChange: (next) => onChange(next as T),
        error,
        placeholder,
        disabled,
        required,
        open,
        setOpen,
        activeIndex,
        setActiveIndex,
        close,
        selectOption,
        containerRef,
        listRef,
        hasHint,
        setHasHint,
      }}
    >
      <div
        ref={containerRef}
        className={cn('relative flex flex-col gap-1.5', wrapperClassName)}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectLabel({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { wrapperClassName?: string }) {
  const { selectId, required } = useSelectContext('SelectLabel')

  return (
    <label
      id={`${selectId}-label`}
      htmlFor={selectId}
      className={cn('text-label font-medium text-text-primary', wrapperClassName)}
      {...props}
    >
      {children}
      {required ? <span className="text-error"> *</span> : null}
    </label>
  )
}

export function SelectHint({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { hintId, setHasHint } = useSelectContext('SelectHint')

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

export function SelectTrigger({
  wrapperClassName,
}: {
  wrapperClassName?: string
}) {
  const {
    selectId,
    listboxId,
    errorId,
    hintId,
    value,
    options,
    error,
    placeholder,
    disabled,
    required,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    close,
    selectOption,
    hasHint,
  } = useSelectContext('SelectTrigger')

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const describedBy =
    [hasHint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
          return
        }
        setActiveIndex((current) => {
          const next =
            event.key === 'ArrowDown'
              ? Math.min(current + 1, options.length - 1)
              : Math.max(current - 1, 0)
          return next
        })
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
          return
        }
        if (activeIndex >= 0) selectOption(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Home':
        if (!open) return
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        if (!open) return
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      default:
        break
    }
  }

  return (
    <button
      id={selectId}
      type="button"
      role="combobox"
      disabled={disabled}
      aria-controls={listboxId}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-labelledby={`${selectId}-label`}
      aria-activedescendant={
        open && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined
      }
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      onClick={() => {
        if (disabled) return
        setOpen((current) => !current)
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex w-full items-center justify-between rounded-control border bg-surface px-3 py-2 text-left text-body text-text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        error ? 'border-error' : 'border-border',
        wrapperClassName,
      )}
    >
      <span className={selectedOption ? undefined : 'text-text-muted'}>
        {selectedOption?.label ?? placeholder}
      </span>
      <span aria-hidden="true" className="text-text-muted">
        ▾
      </span>
    </button>
  )
}

export function SelectListbox({ wrapperClassName }: { wrapperClassName?: string }) {
  const {
    selectId,
    listboxId,
    value,
    options,
    open,
    activeIndex,
    setActiveIndex,
    selectOption,
    listRef,
  } = useSelectContext('SelectListbox')

  useEffect(() => {
    if (!open) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, listRef, open])

  if (!open) return null

  return (
    <ul
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={`${selectId}-label`}
      className={cn(
        'absolute top-full z-20 mt-1 max-h-60 w-full overflow-auto rounded-control border border-border bg-surface-overlay py-1 shadow-overlay',
        wrapperClassName,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value
        const isActive = index === activeIndex

        return (
          <li
            key={option.value}
            id={`${selectId}-option-${index}`}
            role="option"
            aria-selected={isSelected}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectOption(index)}
            className={cn(
              'cursor-pointer px-3 py-2 text-body text-text-primary',
              isActive && 'bg-primary-subtle',
              isSelected && 'font-medium',
            )}
          >
            {option.label}
          </li>
        )
      })}
    </ul>
  )
}

export function SelectError({
  wrapperClassName,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { wrapperClassName?: string }) {
  const { errorId, error } = useSelectContext('SelectError')

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
