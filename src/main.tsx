import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routes/router'
import { ClerkProvider, useUser } from '@clerk/clerk-react'
import './index.css'
import { WhatDoWeCallThisProject } from './routes/admin/what-do-we-call-this-project'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: { colorPrimary: 'var(--primary)' },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
)

function App() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <WhatDoWeCallThisProject showLeaderboard={true} randomizeColors={false}/>
  }

  return <RouterProvider context={{ user }} router={router} />
}
