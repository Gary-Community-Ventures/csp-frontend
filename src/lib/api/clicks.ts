import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

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

  // 404 means the user hasn't clicked yet - this is expected
  if (res.status === 404) {
    return false
  }

  handleStatusCodes(context, res)
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

  const res = await fetch(backendUrl('/clicks'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify(body),
  })

  handleStatusCodes(context, res)
}
