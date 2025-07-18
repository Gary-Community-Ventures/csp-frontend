import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { familyRoute } from './routes'

export type HouseholdInfo = {
  firstName: string
  lastName: string
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

export type NavBarContext = {
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type FamilyContext = {
  householdInfo: HouseholdInfo
  caregivers: Caregiver[]
  transactions: Transaction[]
  navBar: NavBarContext
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: { children: React.ReactNode }) {
  const { familyData } = familyRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const familyContext: FamilyContext = {
    householdInfo: {
      firstName: familyData.household_info.first_name,
      lastName: familyData.household_info.last_name,
      balance: familyData.household_info.balance,
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
