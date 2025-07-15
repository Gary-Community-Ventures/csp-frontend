import { backendUrl, DEFAULT_HEADERS } from '@/lib/requests'

export async function loadFamilyData() {
  const res = await fetch(backendUrl('/family'), { headers: DEFAULT_HEADERS })

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
