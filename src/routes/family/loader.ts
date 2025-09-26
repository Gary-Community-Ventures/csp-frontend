import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import { getFamilyPaymentHistory } from '@/lib/api/paymentHistory'
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
  try {
    // First, fetch family data without childId to get the list of children
    const familyCheckRes = await fetch(backendUrl('/family'), {
      headers: await headersWithAuth(context),
      signal: abortController.signal,
    })

    handleStatusCodes(context, familyCheckRes)
    const familyCheckData = (await familyCheckRes.json()) as Family

    // If a childId is provided, validate it exists
    if (params.childId !== undefined) {
      const childExists = familyCheckData.children.some(
        (child) => child.id === params.childId
      )
      if (!childExists) {
        // Redirect to default child ID if the specified child doesn't exist
        throw redirect({
          to: '/family/$childId/home',
          params: { childId: familyCheckData.selected_child_info.id },
        })
      }
    }

    // Now fetch the family data with the validated childId (or without if not provided)
    let urlPath = '/family'
    if (params.childId !== undefined) {
      urlPath += `/${params.childId}`
    }

    // Load family data and payment history in parallel
    const [familyRes, paymentHistory] = await Promise.all([
      fetch(backendUrl(urlPath), {
        headers: await headersWithAuth(context),
        signal: abortController.signal,
      }),
      getFamilyPaymentHistory(context).catch((error) => {
        console.error('Error loading payment history:', error)
        // Return empty payment history if it fails
        return {
          payments: [],
          total_count: 0,
          total_amount_cents: 0,
        }
      }),
    ])

    handleStatusCodes(context, familyRes)

    const rawJson = (await familyRes.json()) as Family

    const json: Family = rawJson

    return {
      familyData: json,
      paymentHistory,
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
  is_payment_enabled: boolean
}

export type Provider = {
  id: string
  name: string
  status: 'approved' | 'pending' | 'denied'
  type: 'ffn' | 'lhb' | 'center'
  is_payable: boolean
  is_payment_enabled: boolean
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
  children: Child[]
  notifications: Notification[]
  is_also_provider: boolean
  can_make_payments: boolean
}
