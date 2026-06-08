import { createContext, useContext } from 'react'

export interface TextInputContextValue {
  inputId: string
  errorId: string
  hintId: string
  error?: string
  required?: boolean
  disabled?: boolean
  hasHint: boolean
  setHasHint: (value: boolean) => void
}

export const TextInputContext = createContext<TextInputContextValue | null>(null)

export function useTextInputContext(component: string): TextInputContextValue {
  const context = useContext(TextInputContext)
  if (!context) {
    throw new Error(`${component} must be used within TextInput`)
  }
  return context
}
