import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'
import { familyWithIdRoute } from './routes'
import type { FamilyPaymentHistoryResponse } from '@/lib/api/paymentHistory'

export type SelectedChildInfo = {
  id: string
  firstName: string
  lastName: string
  balance: number
}

export type Provider = {
  id: string
  name: string
  status: 'approved' | 'pending' | 'denied'
  type: 'ffn' | 'lhb' | 'center'
}


export type Child = {
  id: string
  firstName: string
  lastName: string
}

export type Notification = {
  type: 'application_pending' | 'application_denied' | 'attendance'
}

export type NavBarContext = {
  notifications: Notification[]
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type FamilyContext = {
  selectedChildInfo: SelectedChildInfo
  providers: Provider[]
  navBar: NavBarContext
  children: Child[]
  isAlsoProvider: boolean
  paymentHistory: FamilyPaymentHistoryResponse
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: PropsWithChildren) {
  const { familyData, paymentHistory } = familyWithIdRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const familyContext: FamilyContext = {
    selectedChildInfo: {
      id: familyData.selected_child_info.id,
      firstName: familyData.selected_child_info.first_name,
      lastName: familyData.selected_child_info.last_name,
      balance: familyData.selected_child_info.balance,
    },
    providers: familyData.providers,
    children: familyData.children.map((child) => {
      return {
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
      }
    }),
    isAlsoProvider: familyData.is_also_provider,
    paymentHistory,
    navBar: {
      notifications: familyData.notifications,
      setHidden,
      hidden,
    },
  }

  return (
    <FamilyContext.Provider value={familyContext}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamilyContext(): FamilyContext {
  const context = useContext(FamilyContext)

  if (context === undefined) {
    throw new Error("'useFamilyContext' must be used within the Wrapper")
  }

  return context
}
