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
    provider_info: rawJson.provider_info,
    children: rawJson.children,
    payments: rawJson.payments.map((payment: any) => ({
      ...payment,
      date: new Date(payment.date),
    })),
    curriculum: rawJson.curriculum,
  }

  return {
    providerData: json,
  }
}

export type ProviderInfo = {
  first_name: string
  last_name: string
}

export type Payment = {
  provider: string
  amount: number
  date: Date
}

export type Curriculum = {
  description: string
}

export type Child = {
  first_name: string
  last_name: string
}

export type Provider = {
  provider_info: ProviderInfo
  children: Child[]
  payments: Payment[]
  curriculum: Curriculum
}
