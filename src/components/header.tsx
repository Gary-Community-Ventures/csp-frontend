import { cn } from '@/lib/utils'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'

type TagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'strong' | 'div'

type BaseProps = {
  children: ReactNode
  className?: string
}

type HeaderProps = {
  [T in TagTypes]: {
    Tag?: T
  } & BaseProps &
    Omit<ComponentPropsWithoutRef<T>, keyof BaseProps>
}[TagTypes]

export function Header({
  children,
  className,
  Tag = 'h2',
  ...rest
}: HeaderProps) {
  return (
    <Tag
      className={cn('text-3xl font-bold text-secondary', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
