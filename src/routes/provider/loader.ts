import { backendUrl, handleStatusCodes, headersWithAuth } from '@/lib/requests'
import type { RouterContext } from '../router'

export async function loadProviderData({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/provider'), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = await res.json()

  const json: Provider = {
    ...rawJson,
    transactions: rawJson.transactions.map((payment: any) => ({
      ...payment,
      date: new Date(payment.date),
    })),
  }

  return {
    providerData: json,
  }
}

export type ProviderInfo = {
  id: number
  first_name: string
  last_name: string
}

export type Transaction = {
  id: number
  name: string
  amount: number
  date: Date
}

export type Curriculum = {
  id: number
  description: string
}

export type Child = {
  id: number
  first_name: string
  last_name: string
}

export type Provider = {
  provider_info: ProviderInfo
  children: Child[]
  transactions: Transaction[]
  curriculum: Curriculum | null
  is_also_family: boolean
}
