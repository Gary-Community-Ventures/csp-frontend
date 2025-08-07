import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { providerWithHomeRoute } from './routes'

export type ProviderInfo = {
  id: number
  firstName: string
  lastName: string
}

export type Transaction = {
  id: number
  name: string
  amount: number
  date: Date
}

export type Curriculum = {
  id: number
  description: string
}

export type Child = {
  id: number
  firstName: string
  lastName: string
}

export type NavBarContext = {
  setHidden: Dispatch<SetStateAction<boolean>>
  hidden: boolean
}

export type ProviderContextType = {
  providerInfo: ProviderInfo
  children: Child[]
  transactions: Transaction[]
  curriculum: Curriculum | null
  navBar: NavBarContext
  isAlsoFamily: boolean
}

const ProviderContext = createContext<ProviderContextType | undefined>(
  undefined
)

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  const { providerData } = providerWithHomeRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const providerContext: ProviderContextType = {
    providerInfo: {
      id: providerData.provider_info.id,
      firstName: providerData.provider_info.first_name,
      lastName: providerData.provider_info.last_name,
    },
    children: providerData.children.map((child) => {
      return {
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
      }
    }),
    transactions: providerData.transactions,
    curriculum: providerData.curriculum,
    isAlsoFamily: providerData.is_also_family,
    navBar: {
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
