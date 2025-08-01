import type { RouterContext } from '@/routes/router'
import { toast } from 'sonner'
import { monthAllocationSchema, paymentRateSchema } from './schemas'
import { z } from 'zod'

export function backendUrl(path: string) {
  return `${import.meta.env.VITE_BACKEND_DOMAIN}${path}`
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export function handleStatusCodes(context: RouterContext, res: Response) {
  if (res.ok) {
    return
  }
  const error_style = {
    background: 'var(--destructive)',
    color: 'var(--primary-foreground)',
    border: '1px solid var(--destructive)',
  }
  if (res.status === 401) {
    authError(context)
  } else if (res.status === 400) {
    toast.error('Bad Request', {
      style: error_style,
    })
  } else if (res.status === 403) {
    toast.error('You do not have permission to perform this action.', {
      style: error_style,
    })
  } else if (res.status === 404) {
    toast.error('Resource not found.', {
      style: error_style,
    })
  } else if (res.status >= 500) {
    toast.error('Server error. Please try again later.', {
      style: error_style,
    })
  } else if (!res.ok) {
    toast.error(`Unexpected error occurred: ${res.status}`, {
      style: error_style,
    })
  }
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

export async function getMonthAllocation(
  context: RouterContext,
  childId: number,
  providerId: number,
  month: number,
  year: number
): Promise<z.infer<typeof monthAllocationSchema>> {
  const url = backendUrl(
    `/child/${childId}/allocation/${month}/${year}?provider_id=${providerId}`
  )
  const res = await fetch(url, {
    headers: await headersWithAuth(context),
  })
  if (res.status === 400) {
    const error: any = new Error('Bad Request')
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

export async function createCareDay(
  context: RouterContext,
  allocationId: number,
  providerId: number,
  date: string,
  type: 'Full Day' | 'Half Day',
) {
  const url = backendUrl('/care-days')
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({ allocation_id: allocationId, provider_id: providerId, date, type }),
  })
  handleStatusCodes(context, res)
  return res.json()
}

export async function updateCareDay(
  context: RouterContext,
  careDayId: number,
  type: 'Full Day' | 'Half Day',
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

export async function submitCareDays(
  context: RouterContext,
  childId: number,
  providerId: number,
  month: number,
  year: number,
) {
  const url = backendUrl(
    `/child/${childId}/provider/${providerId}/allocation/${month}/${year}/submit`,
  )
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
  })
  handleStatusCodes(context, res)
  return res.json()
}

export async function getPaymentRate(
  context: RouterContext,
  providerId: number,
  childId: number,
): Promise<z.infer<typeof paymentRateSchema> | null> {
  const url = backendUrl(`/payment-rates/${providerId}/${childId}`)
  const res = await fetch(url, {
    headers: await headersWithAuth(context),
  })

  if (!res.ok) {
    const errorData = await res.json();
    if (res.status === 404 && errorData.error === "Payment rate not found") {
      return null;
    } else {
      handleStatusCodes(context, res);
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
  }

  try {
    const parsedData = paymentRateSchema.parse(await res.json());
    return parsedData;
  } catch (error) {
    console.error('Zod parsing error for PaymentRate:', error);
    throw error;
  }
}

export async function createPaymentRate(
  context: RouterContext,
  providerId: number,
  childId: number,
  halfDayRateCents: number,
  fullDayRateCents: number,
) {
  const url = backendUrl('/payment-rates')
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      provider_id: providerId,
      child_id: childId,
      half_day_rate: halfDayRateCents,
      full_day_rate: fullDayRateCents,
    }),
  })
  handleStatusCodes(context, res)
  return res.json()
}