import { cn } from '@/lib/utils'
import { type JSX, type PropsWithChildren } from 'react'

type WhiteCardProps = PropsWithChildren<{
  className?: string
  Tag?: keyof JSX.IntrinsicElements
}>

export function WhiteCard({
  children,
  className,
  Tag = 'div',
}: WhiteCardProps) {
  return (
    <Tag className={cn('bg-white rounded-3xl p-5', className)}>{children}</Tag>
  )
}
