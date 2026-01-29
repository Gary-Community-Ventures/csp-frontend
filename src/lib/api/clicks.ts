import type { RouterContext } from '@/routes/router'
import { backendUrl, headersWithAuth } from './client'

type TrackClickParams = {
  trackingId: string
  url?: string
}

export async function checkClicked(
  context: RouterContext,
  trackingId: string
): Promise<boolean> {
  const url =
    backendUrl('/clicks') +
    '?' +
    new URLSearchParams({ tracking_id: trackingId })
  const res = await fetch(url, {
    method: 'GET',
    headers: await headersWithAuth(context),
  })

  if (res.status === 404) {
    return false
  }

  return res.ok
}

export async function trackClick(
  context: RouterContext,
  params: TrackClickParams
): Promise<void> {
  const body: { tracking_id: string; url?: string } = {
    tracking_id: params.trackingId,
  }

  if (params.url) {
    body.url = params.url
  }

  await fetch(backendUrl('/clicks'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify(body),
  })
}
