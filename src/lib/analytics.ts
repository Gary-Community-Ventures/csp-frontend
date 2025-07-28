import { router } from '@/routes/router'
import path from 'path'
import { useEffect } from 'react'

type BaseEvent = {
  event: string
}

type PageViewEvent = {
  event: 'page-view'
  path: string
  query: string
  domain: string
  pageTitle: string
}

type ExternalLinkClick = {
  event: 'external-link'
  externalDomain: string
  externalPath: string
  externalQuery: string
  externalHref: string
}

export type Event = BaseEvent | PageViewEvent | ExternalLinkClick

export function dataLayerPush(data: Event) {
  // @ts-ignore
  const dataLayer: Event[] = window.dataLayer || []

  dataLayer.push(data)
}

export function recordPageView() {
  const url = router.history.location.href
  const query = router.history.location.search
  const domain = window.location.origin
  const title = window.document.title

  dataLayerPush({
    event: 'page-view',
    path: url,
    pageTitle: title,
    domain: domain,
    query: query,
  })
}

export function recordExternalLinkClick(href: string) {
  const location = new URL(href)

  dataLayerPush({
    event: 'external-link',
    externalDomain: location.origin,
    externalPath: location.pathname,
    externalQuery: location.search,
    externalHref: href,
  })
}
