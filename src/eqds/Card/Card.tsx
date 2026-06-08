import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@eqds-utils'
import { CardContext, useCardContext } from './card-context'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode
  wrapperClassName?: string
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  wrapperClassName?: string
}

export function Card({ wrapperClassName, children, ...props }: CardProps) {
  const cardId = useId()

  return (
    <CardContext.Provider value={{ cardId }}>
      <div
        className={cn(
          'rounded-card border border-border bg-surface-raised shadow-card',
          wrapperClassName,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

export function CardHeader({ wrapperClassName, children, ...props }: CardSectionProps) {
  useCardContext('CardHeader')

  return (
    <div
      className={cn('border-b border-border px-4 py-3', wrapperClassName)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  wrapperClassName,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { wrapperClassName?: string }) {
  const { cardId } = useCardContext('CardTitle')

  return (
    <h3
      id={`${cardId}-title`}
      className={cn('text-body-lg font-semibold text-text-primary', wrapperClassName)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ wrapperClassName, children, ...props }: CardSectionProps) {
  useCardContext('CardContent')

  return (
    <div className={cn('px-4 py-3', wrapperClassName)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ wrapperClassName, children, ...props }: CardSectionProps) {
  useCardContext('CardFooter')

  return (
    <div
      className={cn('border-t border-border px-4 py-3', wrapperClassName)}
      {...props}
    >
      {children}
    </div>
  )
}
