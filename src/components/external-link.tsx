import { recordExternalLinkClick } from '@/lib/analytics'
import { trackClick } from '@/lib/api/clicks'
import type { RouterContext } from '@/routes/router'
import type { ComponentProps, PropsWithChildren } from 'react'

type ExternalLinkProps = PropsWithChildren<
  ComponentProps<'a'> & {
    trackingId?: string
    context?: RouterContext
  }
>

export function ExternalLink({
  href,
  children,
  onClick,
  trackingId,
  context,
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

        if (trackingId && context) {
          trackClick(context, { trackingId, url: href })
        }

        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
