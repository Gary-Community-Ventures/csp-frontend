import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export interface FamilyPaymentHistoryItem {
  payment_id: string
  created_at: string
  amount_cents: number
  status: 'success' | 'failed' | 'pending'
  provider_name: string
  provider_id: string
  child_name: string
  child_id: string
  month: string
  payment_type: 'care_days' | 'lump_sum' | 'other'
}

export interface FamilyPaymentHistoryResponse {
  payments: FamilyPaymentHistoryItem[]
  total_count: number
  total_amount_cents: number
}

export interface ProviderPaymentHistoryItem {
  payment_id: string
  created_at: string
  amount_cents: number
  status: 'success' | 'failed' | 'pending'
  child_name: string
  child_id: string
  month: string
  payment_method: string
  payment_type: 'care_days' | 'lump_sum' | 'other'
}

export interface ProviderPaymentHistoryResponse {
  payments: ProviderPaymentHistoryItem[]
  total_count: number
  total_amount_cents: number
  successful_payments_cents: number
}

export async function getFamilyPaymentHistory(context: RouterContext): Promise<FamilyPaymentHistoryResponse> {
  const headers = await headersWithAuth(context)

  const response = await fetch(backendUrl('/family/payments'), {
    method: 'GET',
    headers,
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to fetch family payment history: ${response.status}`)
  }

  return response.json()
}

export async function getProviderPaymentHistory(context: RouterContext): Promise<ProviderPaymentHistoryResponse> {
  const headers = await headersWithAuth(context)

  const response = await fetch(backendUrl('/provider/payments'), {
    method: 'GET',
    headers,
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to fetch provider payment history: ${response.status}`)
  }

  return response.json()
}