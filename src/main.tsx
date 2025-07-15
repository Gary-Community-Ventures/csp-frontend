import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routes/router'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import { WhatDoWeCallThisProject } from './routes/admin/what-do-we-call-this-project'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: { colorPrimary: 'var(--primary)' },
      }}
    >
      <RouterProvider
        router={router}
        defaultPendingMs={300}
        defaultPendingComponent={() => (
          <WhatDoWeCallThisProject randomizeColors={false} />
        )}
      />
    </ClerkProvider>
  )
}
