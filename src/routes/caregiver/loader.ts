import { backendUrl, handleStatusCodes, headersWithAuth } from '@/lib/requests'
import type { RouterContext } from '../router'

export async function loadCaregiverData({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/caregiver'), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = await res.json()

  const json: Caregiver = {
    caregiver_info: rawJson.caregiver_info,
    children: rawJson.children,
    payments: rawJson.payments.map((payment: any) => ({
      ...payment,
      date: new Date(payment.date),
    })),
    curriculum: rawJson.curriculum,
  }

  return {
    caregiverData: json,
  }
}

export type CaregiverInfo = {
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

export type Caregiver = {
  caregiver_info: CaregiverInfo
  children: Child[]
  payments: Payment[]
  curriculum: Curriculum
}
