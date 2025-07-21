import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { providerRoute } from './routes'

export type ProviderInfo = {
  firstName: string
  lastName: string
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
  payments: Payment[]
  curriculum: Curriculum
  navBar: NavBarContext
}

const ProviderContext = createContext<ProviderContextType | undefined>(
  undefined
)

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  const { providerData } = providerRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const providerContext: ProviderContextType = {
    providerInfo: {
      firstName: providerData.provider_info.first_name,
      lastName: providerData.provider_info.last_name,
    },
    children: providerData.children.map((child) => {
      return { firstName: child.first_name, lastName: child.last_name }
    }),
    payments: providerData.payments,
    curriculum: providerData.curriculum,
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
