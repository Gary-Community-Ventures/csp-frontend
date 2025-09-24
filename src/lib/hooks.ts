import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import { useFamilyContext } from '../routes/family/wrapper'
import { useProviderContext } from '../routes/provider/wrapper'

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

export function useHideProviderNavBar() {
  const { navBar } = useProviderContext()

  useEffect(() => {
    navBar.setHidden(true)

    return () => {
      navBar.setHidden(false)
    }
  }, [navBar])
}
