import type { RouterContext } from '@/routes/router'
import { toast } from 'sonner'

export function backendUrl(path: string) {
  return `${import.meta.env.VITE_BACKEND_DOMAIN}${path}`
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export async function handleStatusCodes(context: RouterContext, res: Response) {
  const error_style = {
    background: 'var(--destructive)',
    color: 'var(--primary-foreground)',
    border: '1px solid var(--destructive)',
  }
  if (res.status === 401) {
    authError(context)
  } else if (res.status === 400) {
    const errorData = await res.json();
    toast.error(errorData.description || "Bad Request", {
      style: error_style,
    });
  }
  else if (res.status === 403) {
    toast.error("You do not have permission to perform this action.", {
      style: error_style,
    });
  } else if (res.status === 404) {
    toast.error("Resource not found.", {
      style: error_style,
    });
  }
  else if (res.status >= 500) {
    toast.error("Server error. Please try again later.", {
      style: error_style,
    });
  }
  else if (!res.ok) {
    toast.error(`Unexpected error occurred: ${res.status}`, {
      style: error_style,
    });
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

export async function makePaymentRequest(context: RouterContext, paymentData: { amount: number; providerId: number; hours: number; childId: number }) {
  const res = await fetch(backendUrl('/payment-request'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      amount_in_cents: paymentData.amount,
      google_sheets_provider_id: paymentData.providerId,
      hours: paymentData.hours,
      google_sheets_child_id: paymentData.childId,
    }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to make payment request: ${res.statusText}`)
  }

  return res.json()
}