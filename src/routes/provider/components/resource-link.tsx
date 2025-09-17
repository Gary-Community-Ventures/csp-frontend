import { ExternalLink } from '@/components/external-link'
import type { PropsWithChildren } from 'react'

type ResourceLinkProps = PropsWithChildren<{
  href: string
}>

export function ResourceLink({ href, children }: ResourceLinkProps) {
  return (
    <ExternalLink href={href} className="font-bold text-primary underline">
      {children}
    </ExternalLink>
  )
}
