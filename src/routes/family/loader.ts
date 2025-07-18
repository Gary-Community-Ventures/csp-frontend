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

export type HouseholdInfo = {
  first_name: string
  last_name: string
  balance: number
}

export type Caregiver = {
  name: string
  approved: boolean
}

export type Transaction = {
  provider: string
  amount: number
  date: Date
}

export type Family = {
  household_info: HouseholdInfo
  caregivers: Caregiver[]
  transactions: Transaction[]
}
