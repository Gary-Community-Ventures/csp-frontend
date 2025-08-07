import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'
import { familyWithIdRoute } from './routes'

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
}

export type Transaction = {
  id: string
  name: string
  amount: number
  date: Date
}

export type Child = {
  id: string
  firstName: string
  lastName: string
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
  isAlsoProvider: boolean
}

const FamilyContext = createContext<FamilyContext | undefined>(undefined)

export function FamilyWrapper({ children }: PropsWithChildren) {
  const { familyData } = familyWithIdRoute.useLoaderData()
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
    children: familyData.children.map((child) => {
      return {
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
      }
    }),
    isAlsoProvider: familyData.is_also_provider,
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
