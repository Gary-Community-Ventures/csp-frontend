import type { RouterContext } from '@/routes/router'
import { backendUrl, headersWithAuth } from './client'

type TrackClickParams = {
  trackingId: string
  url?: string
}

/**
 * Check if a user has clicked a tracked element.
 * Returns false if not clicked OR if there's an error (fails open - shows banner).
 * Errors are silent since tracking shouldn't impact user experience.
 */
export async function checkClicked(
  context: RouterContext,
  trackingId: string
): Promise<boolean> {
  const url = backendUrl('/clicks')
  url.searchParams.append('tracking_id', trackingId)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: await headersWithAuth(context),
    })

    // 404 means the user hasn't clicked yet
    if (res.status === 404) {
      return false
    }

    return res.ok
  } catch {
    // Network errors - fail silently, show banner
    return false
  }
}

/**
 * Track a click event. Fails silently since tracking
 * shouldn't impact user experience.
 */
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

  try {
    await fetch(backendUrl('/clicks'), {
      method: 'POST',
      headers: await headersWithAuth(context),
      body: JSON.stringify(body),
    })
  } catch {
    // Silently ignore tracking errors
  }
}
