import { cn } from '@/lib/utils'
import { type JSX, type PropsWithChildren } from 'react'

type HeaderProps = PropsWithChildren<{
  className?: string
  Tag?: keyof JSX.IntrinsicElements
}>

export function Header({ children, className, Tag = 'h2' }: HeaderProps) {
  return (
    <Tag className={cn('text-3xl font-bold text-secondary', className)}>
      {children}
    </Tag>
  )
}
