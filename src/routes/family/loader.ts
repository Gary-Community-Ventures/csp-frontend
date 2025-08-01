import { backendUrl, handleStatusCodes, headersWithAuth } from '@/lib/requests'
import type { RouterContext } from '../router'
import { redirect } from '@tanstack/react-router'

export async function loadFamilyData({
  context,
  abortController,
  params,
}: {
  context: RouterContext
  abortController: AbortController
  params: { childId?: number }
}) {
  let urlPath = '/family'
  if (params.childId !== undefined) {
    urlPath += `/${params.childId}`
  }

  const res = await fetch(backendUrl(urlPath), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = await res.json()

  const json: Family = {
    ...rawJson,
    transactions: rawJson.transactions.map((cg: any) => ({
      ...cg,
      date: new Date(cg.date),
    })),
  }

  return {
    familyData: json,
  }
}

export async function redirectToDefaultId({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/family/default_child_id'), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = await res.json()

  throw redirect({
    to: '/family/$childId/home',
    params: { childId: rawJson.child_id },
  })
}

export type SelectedChildInfo = {
  id: number
  first_name: string
  last_name: string
  balance: number
}

export type Provider = {
  id: number
  name: string
  status: 'approved' | 'pending' | 'denied'
}

export type Transaction = {
  id: number
  name: string
  amount: number
  date: Date
}

export type Child = {
  id: number
  first_name: string
  last_name: string
}

export type Family = {
  selected_child_info: SelectedChildInfo
  providers: Provider[]
  transactions: Transaction[]
  children: Child[]
  is_also_provider: boolean
}
