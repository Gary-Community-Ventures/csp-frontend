import { recordExternalLinkClick } from '@/lib/analytics'
import type { ComponentProps, PropsWithChildren } from 'react'

type ExternalLinkProps = PropsWithChildren<ComponentProps<'a'>>

export function ExternalLink({
  href,
  children,
  onClick,
  ...restOfProps
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      {...restOfProps}
      onClick={(e) => {
        if (href !== undefined) {
          recordExternalLinkClick(href)
        }
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
