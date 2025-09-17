import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'

export type HeaderTagTypes =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'strong'
  | 'div'

type BaseProps = {
  children: ReactNode
  className?: string
}

type HeaderProps = {
  [T in HeaderTagTypes]: {
    Tag?: T
  } & BaseProps &
    Omit<ComponentPropsWithoutRef<T>, keyof BaseProps>
}[HeaderTagTypes]

const sizeClasses: Record<HeaderTagTypes, string> = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
  strong: 'text-3xl',
  div: 'text-3xl',
}

export function Header({
  children,
  className,
  Tag = 'h2',
  ...rest
}: HeaderProps) {
  return (
    <Tag
      className={cn(sizeClasses[Tag], 'font-bold text-secondary', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
