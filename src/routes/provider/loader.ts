import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import type { RouterContext } from '../router'

export async function loadProviderData({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  try {
    const res = await fetch(backendUrl('/provider'), {
      headers: await headersWithAuth(context),
      signal: abortController.signal,
    })

    handleStatusCodes(context, res)

    const rawJson = (await res.json()) as Provider

    const json: Provider = {
      ...rawJson,
      transactions: rawJson.transactions.map((payment) => ({
        ...payment,
        date: new Date(payment.date),
      })),
    }

    return {
      providerData: json,
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
}

export type Transaction = {
  id: string
  name: string
  amount: number
  date: Date
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

export type Provider = {
  provider_info: ProviderInfo
  children: Child[]
  transactions: Transaction[]
  curriculum: Curriculum | null
  is_also_family: boolean
  max_child_count: number
}
