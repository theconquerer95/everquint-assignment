import { createContext, useContext } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonContextValue {
  variant: ButtonVariant
  size: ButtonSize
  disabled?: boolean
}

export const ButtonContext = createContext<ButtonContextValue | null>(null)

export function useButtonContext(component: string): ButtonContextValue {
  const context = useContext(ButtonContext)
  if (!context) {
    throw new Error(`${component} must be used within Button`)
  }
  return context
}
