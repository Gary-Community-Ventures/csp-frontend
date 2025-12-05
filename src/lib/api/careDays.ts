import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export async function createCareDay(
  context: RouterContext,
  allocationId: number,
  providerId: string,
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

  // Handle 400 errors - log backend message for Sentry, throw generic error for UI
  if (res.status === 400) {
    const errorData = await res.json()
    console.error('Care day creation failed:', errorData.error)
    throw new Error('CARE_DAY_ERROR')
  }

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

  // Handle 400 errors - log backend message for Sentry, throw generic error for UI
  if (res.status === 400) {
    const errorData = await res.json()
    console.error('Care day update failed:', errorData.error)
    throw new Error('CARE_DAY_ERROR')
  }

  handleStatusCodes(context, res)
  return res.json()
}

export async function deleteCareDay(context: RouterContext, careDayId: number) {
  const url = backendUrl(`/care-days/${careDayId}`)
  const res = await fetch(url, {
    method: 'DELETE',
    headers: await headersWithAuth(context),
  })

  // Handle 400 errors - log backend message for Sentry, throw generic error for UI
  if (res.status === 400) {
    const errorData = await res.json()
    console.error('Care day deletion failed:', errorData.error)
    throw new Error('CARE_DAY_ERROR')
  }

  handleStatusCodes(context, res)
  return res
}
