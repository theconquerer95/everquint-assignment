import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from 'react'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectContextValue {
  selectId: string
  listboxId: string
  errorId: string
  hintId: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  error?: string
  placeholder: string
  disabled: boolean
  required: boolean
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  close: () => void
  selectOption: (index: number) => void
  containerRef: RefObject<HTMLDivElement | null>
  listRef: RefObject<HTMLUListElement | null>
  hasHint: boolean
  setHasHint: (value: boolean) => void
}

export const SelectContext = createContext<SelectContextValue | null>(null)

export function useSelectContext(component: string): SelectContextValue {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error(`${component} must be used within Select`)
  }
  return context
}
