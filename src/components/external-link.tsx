import { recordExternalLinkClick } from '@/lib/analytics'
import { trackClick } from '@/lib/api/clicks'
import { rootRoute } from '@/routes/router'
import type { ComponentProps, PropsWithChildren } from 'react'

type ExternalLinkProps = PropsWithChildren<
  ComponentProps<'a'> & {
    trackingId?: string
  }
>

export function ExternalLink({
  href,
  children,
  onClick,
  trackingId,
  ...restOfProps
}: ExternalLinkProps) {
  const context = rootRoute.useRouteContext()

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

        if (trackingId) {
          trackClick(context, { trackingId, url: href }).catch(() => {
            // Intentionally ignore tracking errors to avoid impacting user experience
          })
        }

        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
