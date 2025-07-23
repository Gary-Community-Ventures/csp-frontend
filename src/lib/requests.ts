import type { RouterContext } from '@/routes/router'
import { toast } from 'sonner'

export function backendUrl(path: string) {
  return `${import.meta.env.VITE_BACKEND_DOMAIN}${path}`
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export function handleStatusCodes(context: RouterContext, res: Response) {
  if (res.status === 401) {
    authError(context)
  }

  // TODO: handle the other status codes
}

export async function headersWithAuth(context: RouterContext) {
  if (context.user === null || !context.isSignedIn) {
    authError(context)
  }

  return {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${await context.getToken()}`,
  }
}

function authError(context: RouterContext) {
  toast('Please Sign In')
  context.clerk?.signOut()
  context.clerk?.redirectToSignIn()
}

export async function makePaymentRequest(context: RouterContext, paymentData: { amount: number; providerId: number; hours: number; childId: number }) {
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

  if (!res.ok) {
    handleStatusCodes(context, res)
    return
  }

  return res.json()
}