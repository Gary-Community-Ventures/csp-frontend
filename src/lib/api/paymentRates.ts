import type { RouterContext } from '@/routes/router'
import { paymentRateSchema } from '../schemas'
import { z } from 'zod'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export type GetPaymentRateResponse = z.infer<typeof paymentRateSchema>

export async function getPaymentRate(
  context: RouterContext,
  providerId: string,
  childId: string
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
