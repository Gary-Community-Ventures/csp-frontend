import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export interface PaymentSettingsResponse {
  provider_id: string
  chek_user_id: string | null
  payment_method: string | null
  payment_method_updated_at: string | null
  payable: boolean
  needs_refresh: boolean
  last_sync: string | null
  card: {
    available: boolean
    status: string | null
    id: string | null
  }
  ach: {
    available: boolean
    status: string | null
    id: string | null
  }
  validation: {
    is_valid: boolean
    message: string
  }
}

export interface PaymentMethodUpdateRequest {
  payment_method: 'card' | 'ach'
}

export interface PaymentMethodUpdateResponse {
  message: string
  provider_id: string
  payment_method: string
  payment_method_updated_at: string
  payable: boolean
}

export async function getPaymentSettings(context: RouterContext): Promise<PaymentSettingsResponse> {
  const headers = await headersWithAuth(context)
  
  const response = await fetch(backendUrl('/provider/payment-settings'), {
    method: 'GET',
    headers,
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to fetch payment settings: ${response.status}`)
  }

  return response.json()
}

export async function updatePaymentMethod(
  context: RouterContext,
  request: PaymentMethodUpdateRequest
): Promise<PaymentMethodUpdateResponse> {
  const headers = await headersWithAuth(context)

  const response = await fetch(backendUrl('/provider/payment-settings'), {
    method: 'PUT',
    headers,
    body: JSON.stringify(request),
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to update payment method: ${response.status}`)
  }

  return response.json()
}