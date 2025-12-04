import type { RouterContext } from '@/routes/router'
import { monthAllocationSchema } from '../schemas'
import { z } from 'zod'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export type GetMonthAllocationResponse = z.infer<typeof monthAllocationSchema>

export async function getMonthAllocation(
  context: RouterContext,
  childId: string,
  month: number,
  year: number,
  providerId?: string | undefined
): Promise<z.infer<typeof monthAllocationSchema>> {
  let url = backendUrl(`/child/${childId}/allocation/${month}/${year}`)
  if (providerId !== undefined) {
    url += `?provider_id=${providerId}`
  }
  const res = await fetch(url, {
    headers: await headersWithAuth(context),
  })
  interface CustomError extends Error {
    response?: Response
  }

  if (res.status === 400) {
    const error: CustomError = new Error('Bad Request')
    error.response = res
    throw error
  }
  handleStatusCodes(context, res)
  const data = await res.json()
  try {
    const parsedData = monthAllocationSchema.parse(data)
    return parsedData
  } catch (error) {
    console.error('Zod parsing error for MonthAllocation:', error)
    throw error // Re-throw the error so useQuery can catch it
  }
}

export async function submitCareDays(
  context: RouterContext,
  childId: string,
  providerId: string,
  month: number,
  year: number
) {
  const url = backendUrl(
    `/child/${childId}/provider/${providerId}/allocation/${month}/${year}/submit`
  )
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
  })

  // Handle 400 errors - log backend message for Sentry, throw generic error for UI
  if (res.status === 400) {
    const errorData = await res.json()
    console.error('Care days submission failed:', errorData.error)
    throw new Error('PAYMENT_SUBMISSION_ERROR')
  }

  handleStatusCodes(context, res)
  return res.json()
}
