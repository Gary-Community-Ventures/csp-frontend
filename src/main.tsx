import { LoadingPage } from '@/components/pages/loading-page'
import { NotFoundPage } from '@/components/pages/not-found-page'
import { StrictMode, type PropsWithChildren } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router, type RouterContext } from '@/routes/router'
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import './index.css'
import { Toaster } from 'sonner'
import { LanguageWrapper, useLanguageContext } from './translations/wrapper'
import { enUS, esES } from '@clerk/localizations'
import ErrorFallback from '@/components/error-fallback'
import { initializeSentry } from '@/lib/sentry'
import { useSentryUserContext } from '@/lib/hooks'

initializeSentry()

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageWrapper>
      <ClerkWrapper>
        <App />
      </ClerkWrapper>
    </LanguageWrapper>
    <Toaster closeButton={true} />
  </StrictMode>
)

function ClerkWrapper({ children }: PropsWithChildren) {
  const { lang } = useLanguageContext()

  let locale = enUS
  if (lang === 'es') {
    locale = esES
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      appearance={{
        variables: { colorPrimary: 'var(--primary)' },
      }}
      localization={locale}
    >
      {children}
    </ClerkProvider>
  )
}

function App() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const clerk = useClerk()

  useSentryUserContext()

  if (!isLoaded) {
    return null
  }

  const context: RouterContext = {
    user,
    isSignedIn,
    getToken,
    clerk,
  }

  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      <RouterProvider
        router={router}
        defaultPendingMs={300}
        defaultPendingComponent={LoadingPage}
        defaultNotFoundComponent={NotFoundPage}
        defaultStaleTime={5 * 60 * 1000}
        context={context}
      />
    </Sentry.ErrorBoundary>
  )
}
