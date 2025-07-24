import { LoadingPage } from '@/components/pages/loading-page';
import { NotFoundPage } from '@/components/pages/not-found-page';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router, type RouterContext } from '@/routes/router'
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/clerk-react'
import './index.css'
import { Toaster } from 'sonner'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl='/auth/sign-in'
      signUpUrl='/auth/sign-up'
      appearance={{
        variables: { colorPrimary: 'var(--primary)' },
      }}
    >
      <App />
    </ClerkProvider>
    <Toaster closeButton={true} />
  </StrictMode>
)

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
      defaultPendingComponent={LoadingPage}
      defaultNotFoundComponent={NotFoundPage}
      context={context}
    />
  )
}
