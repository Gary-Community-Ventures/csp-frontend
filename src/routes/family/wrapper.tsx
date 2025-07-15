import { createContext, useContext } from 'react'
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

export type FamilyContext = {
  householdInfo: HouseholdInfo
  caregivers: Caregiver[]
  transactions: Transaction[]
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: { children: React.ReactNode }) {
  const { familyData } = familyRoute.useLoaderData()

  const familyContext: FamilyContext = {
    householdInfo: {
      firstName: familyData.household_info.first_name,
      lastName: familyData.household_info.last_name,
      balance: familyData.household_info.balance,
    },
    caregivers: familyData.caregivers,
    transactions: familyData.transactions,
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
