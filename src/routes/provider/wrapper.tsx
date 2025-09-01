import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { providerRoute } from './routes'
import type { ProviderPaymentHistoryResponse } from '@/lib/api/paymentHistory'

export type ProviderInfo = {
  id: string
  firstName: string
  lastName: string
  isPayable: boolean
}

export type Curriculum = {
  id: string
  description: string
}

export type Child = {
  id: string
  firstName: string
  lastName: string
  fullDayRateCents: number
  halfDayRateCents: number
}

export type Notification = {
  type: 'application_pending' | 'application_denied' | 'attendance'
}

export type NavBarContext = {
  notifications: Notification[]
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type ProviderContextType = {
  providerInfo: ProviderInfo
  children: Child[]
  curriculum: Curriculum | null
  navBar: NavBarContext
  maxChildCount: number
  isAlsoFamily: boolean
  paymentHistory: ProviderPaymentHistoryResponse
}

const ProviderContext = createContext<ProviderContextType | undefined>(
  undefined
)

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  const { providerData, paymentHistory } = providerRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const providerContext: ProviderContextType = {
    providerInfo: {
      id: providerData.provider_info.id,
      firstName: providerData.provider_info.first_name,
      lastName: providerData.provider_info.last_name,
      isPayable: providerData.provider_info.is_payable,
    },
    children: providerData.children.map((child) => {
      return {
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
        fullDayRateCents: child.full_day_rate_cents,
        halfDayRateCents: child.half_day_rate_cents,
      }
    }),
    curriculum: providerData.curriculum,
    maxChildCount: providerData.max_child_count,
    isAlsoFamily: providerData.is_also_family,
    paymentHistory,
    navBar: {
      notifications: providerData.notifications,
      setHidden,
      hidden,
    },
  }

  return (
    <ProviderContext.Provider value={providerContext}>
      {children}
    </ProviderContext.Provider>
  )
}

export function useProviderContext(): ProviderContextType {
  const context = useContext(ProviderContext)

  if (context === undefined) {
    throw new Error("'useProviderContext' must be used within the Wrapper")
  }

  return context
}
