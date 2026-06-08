import { createContext, useContext } from 'react'

export interface CardContextValue {
  cardId: string
}

export const CardContext = createContext<CardContextValue | null>(null)

export function useCardContext(component: string): CardContextValue {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error(`${component} must be used within Card`)
  }
  return context
}
