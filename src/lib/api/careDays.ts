import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export async function createCareDay(
  context: RouterContext,
  allocationId: number,
  providerId: number,
  date: string,
  type: 'Full Day' | 'Half Day'
) {
  const url = backendUrl('/care-days')
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      allocation_id: allocationId,
      provider_id: providerId,
      date,
      type,
    }),
  })
  handleStatusCodes(context, res)
  return res.json()
}

export async function updateCareDay(
  context: RouterContext,
  careDayId: number,
  type: 'Full Day' | 'Half Day'
) {
  const url = backendUrl(`/care-days/${careDayId}`)
  const res = await fetch(url, {
    method: 'PUT',
    headers: await headersWithAuth(context),
    body: JSON.stringify({ type }),
  })
  handleStatusCodes(context, res)
  return res.json()
}

export async function deleteCareDay(context: RouterContext, careDayId: number) {
  const url = backendUrl(`/care-days/${careDayId}`)
  const res = await fetch(url, {
    method: 'DELETE',
    headers: await headersWithAuth(context),
  })
  handleStatusCodes(context, res)
  return res
}
