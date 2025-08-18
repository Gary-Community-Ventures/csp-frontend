import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import type { RouterContext } from '../router'
import { redirect } from '@tanstack/react-router'

export async function loadFamilyData({
  context,
  abortController,
  params,
}: {
  context: RouterContext
  abortController: AbortController
  params: { childId?: string }
}) {
  let urlPath = '/family'
  if (params.childId !== undefined) {
    urlPath += `/${params.childId}`
  }

  try {
    const res = await fetch(backendUrl(urlPath), {
      headers: await headersWithAuth(context),
      signal: abortController.signal,
    })

    handleStatusCodes(context, res)

    const rawJson = (await res.json()) as Family

    const json: Family = {
      ...rawJson,
      transactions: rawJson.transactions.map((cg) => ({
        ...cg,
        date: new Date(cg.date),
      })),
    }

    return {
      familyData: json,
    }
  } catch (error) {
    console.error('Error loading family data:', error)
    throw error // Re-throw the error to be caught by the router's errorComponent
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
  id: string
  first_name: string
  last_name: string
  balance: number
}

export type Provider = {
  id: string
  name: string
  status: 'approved' | 'pending' | 'denied'
}

export type Transaction = {
  id: string
  name: string
  amount: number
  date: Date
}

export type Child = {
  id: string
  first_name: string
  last_name: string
}

export type Notification = {
  type: 'application_pending' | 'application_denied' | 'attendance'
}

export type Family = {
  selected_child_info: SelectedChildInfo
  providers: Provider[]
  transactions: Transaction[]
  children: Child[]
  notifications: Notification[]
  is_also_provider: boolean
}
