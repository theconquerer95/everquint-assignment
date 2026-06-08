import { createContext, useContext } from 'react'

export interface TextAreaContextValue {
  inputId: string
  errorId: string
  hintId: string
  error?: string
  required?: boolean
  disabled?: boolean
  hasHint: boolean
  setHasHint: (value: boolean) => void
}

export const TextAreaContext = createContext<TextAreaContextValue | null>(null)

export function useTextAreaContext(component: string): TextAreaContextValue {
  const context = useContext(TextAreaContext)
  if (!context) {
    throw new Error(`${component} must be used within TextArea`)
  }
  return context
}
