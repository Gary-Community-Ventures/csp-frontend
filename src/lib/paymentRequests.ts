import type { RouterContext } from '@/routes/router'
import { backendUrl, headersWithAuth, handleStatusCodes } from './requests'

export async function makePaymentRequest(
  context: RouterContext,
  paymentData: {
    amount: number
    providerId: number
    hours: number
    childId: number
  }
) {
  const res = await fetch(backendUrl('/payment-request'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      amount_in_cents: paymentData.amount,
      provider_id: paymentData.providerId,
      hours: paymentData.hours,
      child_id: paymentData.childId,
    }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to make payment request: ${res.statusText}`)
  }

  return res.json()
}
