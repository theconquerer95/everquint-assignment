import { createContext, useContext, type RefObject } from 'react'

export interface ModalContextValue {
  titleId: string
  descriptionId: string
  dialogRef: RefObject<HTMLDivElement | null>
  setHasDescription: (value: boolean) => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModalContext(component: string): ModalContextValue {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error(`${component} must be used within Modal`)
  }
  return context
}
