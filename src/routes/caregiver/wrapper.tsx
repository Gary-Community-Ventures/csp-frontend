import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { caregiverRoute } from './routes'

export type CaregiverInfo = {
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

export type CaregiverContextType = {
  caregiverInfo: CaregiverInfo
  children: Child[]
  payments: Payment[]
  curriculum: Curriculum
  navBar: NavBarContext
}

const CaregiverContext = createContext<CaregiverContextType | undefined>(
  undefined
)

export function CaregiverWrapper({ children }: { children: React.ReactNode }) {
  const { caregiverData } = caregiverRoute.useLoaderData()
  const [hidden, setHidden] = useState<boolean>(false)

  const caregiverContext: CaregiverContextType = {
    caregiverInfo: {
      firstName: caregiverData.caregiver_info.first_name,
      lastName: caregiverData.caregiver_info.last_name,
    },
    children: caregiverData.children.map((child) => {
      return { firstName: child.first_name, lastName: child.last_name }
    }),
    payments: caregiverData.payments,
    curriculum: caregiverData.curriculum,
    navBar: {
      setHidden,
      hidden,
    },
  }

  return (
    <CaregiverContext.Provider value={caregiverContext}>
      {children}
    </CaregiverContext.Provider>
  )
}

export function useCaregiverContext(): CaregiverContextType {
  const context = useContext(CaregiverContext)

  if (context === undefined) {
    throw new Error("'useCaregiverContext' must be used within the Wrapper")
  }

  return context
}
