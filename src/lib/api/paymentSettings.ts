import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export interface PaymentSettingsResponse {
  provider_id: string
  chek_user_id: string | null
  payment_method: string | null
  payment_method_updated_at: string | null
  is_payable: boolean
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
  is_payable: boolean
}

export interface PaymentMethodInitializeRequest {
  payment_method: 'card' | 'ach'
}

export interface PaymentInitializationResponse {
  message: string
  payment_method: string
  provider_id: string
  chek_user_id: string | null
  card_id: string | null
  direct_pay_id: string | null
  invite_sent_to: string | null
  already_exists: boolean
}

export async function getPaymentSettings(
  context: RouterContext
): Promise<PaymentSettingsResponse> {
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

export async function initializePaymentMethod(
  context: RouterContext,
  request: PaymentMethodInitializeRequest
): Promise<PaymentInitializationResponse> {
  const headers = await headersWithAuth(context)

  const response = await fetch(backendUrl('/provider/initialize-my-payment'), {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to initialize payment method: ${response.status}`)
  }

  return response.json()
}
