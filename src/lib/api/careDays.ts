import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

class CareDayError extends Error {
  response: Response
  errorData: { error?: string }

  constructor(
    message: string,
    response: Response,
    errorData: { error?: string }
  ) {
    super(message)
    this.name = 'CareDayError'
    this.response = response
    this.errorData = errorData
  }
}

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

  // Handle 400 errors specially to preserve error message
  if (res.status === 400) {
    const errorData = await res.json()
    throw new CareDayError(errorData.error || 'Bad Request', res, errorData)
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

  // Handle 400 errors specially to preserve error message
  if (res.status === 400) {
    const errorData = await res.json()
    throw new CareDayError(errorData.error || 'Bad Request', res, errorData)
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

  // Handle 400 errors specially to preserve error message
  if (res.status === 400) {
    const errorData = await res.json()
    throw new CareDayError(errorData.error || 'Bad Request', res, errorData)
  }

  handleStatusCodes(context, res)
  return res
}
