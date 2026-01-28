import type { RouterContext } from '@/routes/router'
import { backendUrl, headersWithAuth } from './client'

export async function checkLinkClicked(
  context: RouterContext,
  link: string
): Promise<boolean> {
  const url = backendUrl('/click-link') + '?' + new URLSearchParams({ link })
  const res = await fetch(url, {
    method: 'GET',
    headers: await headersWithAuth(context),
  })

  if (res.status === 404) {
    return false
  }

  return res.ok
}

export async function trackLinkClick(
  context: RouterContext,
  link: string
): Promise<void> {
  const url = backendUrl('/click-link')
  await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({ link }),
  })
}
