import type { RouterContext } from '@/routes/router'
import { paymentRateSchema } from '../schemas'
import { z } from 'zod'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export async function getPaymentRate(
  context: RouterContext,
  providerId: number,
  childId: number
): Promise<z.infer<typeof paymentRateSchema> | null> {
  const url = backendUrl(`/payment-rates/${providerId}/${childId}`)
  const res = await fetch(url, {
    headers: await headersWithAuth(context),
  })

  if (!res.ok) {
    const errorData = await res.json()
    if (res.status === 404 && errorData.error === 'Payment rate not found') {
      return null
    } else {
      handleStatusCodes(context, res)
      throw new Error(
        errorData.error || `Request failed with status ${res.status}`
      )
    }
  }

  try {
    const parsedData = paymentRateSchema.parse(await res.json())
    return parsedData
  } catch (error) {
    console.error('Zod parsing error for PaymentRate:', error)
    throw error
  }
}

export async function createPaymentRate(
  context: RouterContext,
  providerId: number,
  childId: number,
  halfDayRateCents: number,
  fullDayRateCents: number
) {
  const url = backendUrl('/payment-rates')
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      google_sheets_provider_id: providerId,
      google_sheets_child_id: childId,
      half_day_rate_cents: halfDayRateCents,
      full_day_rate_cents: fullDayRateCents,
    }),
  })
  handleStatusCodes(context, res)
  return res.json()
}
