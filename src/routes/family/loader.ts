import { backendUrl, handleStatusCodes, headersWithAuth } from '@/lib/requests'
import type { RouterContext } from '../router'

export async function loadFamilyData({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/family'), {
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

export type SelectedChildInfo = {
  id: number
  first_name: string
  last_name: string
  balance: number
}

export type Caregiver = {
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
  caregivers: Caregiver[]
  transactions: Transaction[]
  children: Child[]
}
