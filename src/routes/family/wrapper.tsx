import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { familyRoute } from './routes'

export type FamilyInfo = {
  firstName: string
  lastName: string
  balance: number
}

export type Caregiver = {
  name: string
  status: 'approved' | 'pending' | 'denied'
}

export type Transaction = {
  provider: string
  amount: number
  date: Date
}

export type NavBarContext = {
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type FamilyContext = {
  familyInfo: FamilyInfo
  caregivers: Caregiver[]
  transactions: Transaction[]
  navBar: NavBarContext
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: { children: React.ReactNode }) {
  const { familyData } = familyRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const familyContext: FamilyContext = {
    familyInfo: {
      firstName: familyData.family_info.first_name,
      lastName: familyData.family_info.last_name,
      balance: familyData.family_info.balance,
    },
    caregivers: familyData.caregivers,
    transactions: familyData.transactions,
    navBar: {
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
