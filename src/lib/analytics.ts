import { router } from '@/routes/router'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

type PageViewEvent = {
  event: 'page-view'
  path: string
  query: string
  domain: string
  pageTitle: string
}

type ExternalLinkClickEvent = {
  event: 'external-link'
  externalDomain: string
  externalPath: string
  externalQuery: string
  externalHref: string
}

type UserSessionEvent = {
  event: 'user-session'
  isSignedIn: boolean
  familyId: number | null
  providerId: number | null
  types: string[] | null
}

export type Event = PageViewEvent | ExternalLinkClickEvent | UserSessionEvent

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

export function useRecordUserSession() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (!isSignedIn) {
      dataLayerPush({
        event: 'user-session',
        isSignedIn: false,
        familyId: null,
        providerId: null,
        types: null,
      })
      return
    }

    const familyId = user.publicMetadata.family_id as number
    const providerId = user.publicMetadata.provider_id as number
    const types = user.publicMetadata.types as string[]

    dataLayerPush({
      event: 'user-session',
      isSignedIn: true,
      familyId: familyId ?? null,
      providerId: providerId ?? null,
      types: types ?? null,
    })
  }, [user, isLoaded, isSignedIn])
}
