import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { familyRoute } from './routes'

export type SelectedChildInfo = {
  id: number
  firstName: string
  lastName: string
  balance: number
}

export type Provider = {
  id: number
  name: string
  status: 'approved' | 'pending' | 'denied'
}

export type Transaction = {
  id: number
  name: string
  amount: number
  date: Date
}

export type Child = {
  id: number
  first_name: string
  last_name: string
}

export type NavBarContext = {
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type FamilyContext = {
  selectedChildInfo: SelectedChildInfo
  providers: Provider[]
  transactions: Transaction[]
  navBar: NavBarContext
  children: Child[]
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: { children: React.ReactNode }) {
  const { familyData } = familyRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const familyContext: FamilyContext = {
    selectedChildInfo: {
      id: familyData.selected_child_info.id,
      firstName: familyData.selected_child_info.first_name,
      lastName: familyData.selected_child_info.last_name,
      balance: familyData.selected_child_info.balance,
    },
    providers: familyData.providers,
    transactions: familyData.transactions,
    children: familyData.children,
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
