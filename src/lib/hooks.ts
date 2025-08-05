import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import { useFamilyContext } from '../routes/family/wrapper'
import { useQuery } from '@tanstack/react-query'
import { getMonthAllocation } from '@/lib/api/children'
import * as RouterModule from '@/routes/router'

export function useBackgroundColor(color: string) {
  useEffect(() => {
    document.documentElement.style.setProperty('--body-background', color)

    return () => {
      document.documentElement.style.setProperty(
        '--body-background',
        'var(--background)'
      )
    }
  }, [color])
}

export function useSentryUserContext() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded) {
      if (user && isSignedIn) {
        Sentry.setUser({
          id: user.id,
          email:
            user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses[0]?.emailAddress,
        })
        Sentry.setTag('user.signedIn', 'true')
      } else {
        Sentry.setUser(null)
        Sentry.setTag('user.signedIn', 'false')
      }
    }
  }, [user, isLoaded, isSignedIn])
}

export function useHideFamilyNavBar() {
  const { navBar } = useFamilyContext()

  useEffect(() => {
    navBar.setHidden(true)

    return () => {
      navBar.setHidden(false)
    }
  }, [navBar])
}

export function useCurrentMonthBalance(
  context: RouterModule.RouterContext,
  childId: number,
  providerId?: number
) {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const { data: allocation } = useQuery({
    queryKey: [
      'currentMonthAllocation',
      childId,
      currentMonth,
      currentYear,
      providerId,
    ],
    queryFn: () =>
      getMonthAllocation(
        context,
        childId,
        currentMonth,
        currentYear,
        providerId
      ),
    enabled: !!childId && !!context,
    retry: false, // Do not retry on failure, as per requirement
    throwOnError: false, // Do not throw error, handle it gracefully
  })

  return allocation?.remaining_cents
}
