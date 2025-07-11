import { createContext, useContext } from 'react'

export type Caregiver = {
  name: string
  aproved: boolean
}

export type Transaction = {
  provider: string
  amount: number
  date: Date
}

export type FamilyContext = {
  firstName: string
  lastName: string
  balance: number
  caregivers: Caregiver[]
  transactions: Transaction[]
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: { children: React.ReactNode }) {
  const firstName = 'Diaper'
  const lastName = 'Dollars'
  const balance = 1200
  const caregivers: Caregiver[] = [
    { name: 'Diaper Dollars', aproved: false },
    { name: 'Sippy Cup Support', aproved: false },
    { name: 'My Friend Benny', aproved: true },
    { name: 'Go-Go Gaga Grant', aproved: true },
    { name: 'The Swing Set Stipend', aproved: true },
    { name: 'The Procreation Payout', aproved: true },
    { name: 'The Sitter Stipend', aproved: true },
  ]
  const transactions: Transaction[] = [
    {
      provider: 'Diaper Dollars',
      amount: -100,
      date: new Date(),
    },
    {
      provider: 'Sippy Cup Support',
      amount: -200,
      date: new Date(),
    },
    {
      provider: 'Child Care Subsidy',
      amount: 1200,
      date: new Date(),
    },
  ]

  return (
    <FamilyContext.Provider
      value={{ firstName, lastName, balance, caregivers, transactions }}
    >
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
