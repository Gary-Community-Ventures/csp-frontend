import { StrictMode, type PropsWithChildren } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router, type RouterContext } from '@/routes/router'
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/clerk-react'
import './index.css'
import { WhatDoWeCallThisProject } from './routes/admin/what-do-we-call-this-project'
import { Toaster } from 'sonner'
import { LanguageWrapper, useLanguageContext } from './translations/wrapper'
import { enUS, esES } from '@clerk/localizations'

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
    <RouterProvider
      router={router}
      defaultPendingMs={300}
      defaultPendingComponent={() => (
        <WhatDoWeCallThisProject randomizeColors={false} />
      )}
      defaultNotFoundComponent={() => (
        <WhatDoWeCallThisProject randomizeColors={false} />
      )}
      defaultStaleTime={5 * 60 * 1000}
      context={context}
    />
  )
}
