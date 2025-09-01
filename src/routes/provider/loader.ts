import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import { getProviderPaymentHistory } from '@/lib/api/paymentHistory'
import type { RouterContext } from '../router'

export async function loadProviderData({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  try {
    // Load provider data and payment history in parallel
    const [providerRes, paymentHistory] = await Promise.all([
      fetch(backendUrl('/provider'), {
        headers: await headersWithAuth(context),
        signal: abortController.signal,
      }),
      getProviderPaymentHistory(context).catch((error) => {
        console.error('Error loading payment history:', error)
        // Return empty payment history if it fails
        return {
          payments: [],
          total_count: 0,
          total_amount_cents: 0,
          successful_payments_cents: 0,
        }
      }),
    ])

    handleStatusCodes(context, providerRes)

    const rawJson = (await providerRes.json()) as Provider

    const json: Provider = rawJson

    return {
      providerData: json,
      paymentHistory,
    }
  } catch (error) {
    console.error('Error loading provider data:', error)
    throw error // Re-throw the error to be caught by the router's errorComponent
  }
}

export type ProviderInfo = {
  id: string
  first_name: string
  last_name: string
  is_payable: boolean
}

export type Curriculum = {
  id: string
  description: string
}

export type Child = {
  id: string
  first_name: string
  last_name: string
}

export type Notification = {
  type: 'application_pending' | 'application_denied' | 'attendance'
}

export type Provider = {
  provider_info: ProviderInfo
  children: Child[]
  curriculum: Curriculum | null
  notifications: Notification[]
  is_also_family: boolean
  max_child_count: number
}
