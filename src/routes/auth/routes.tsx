import { createRoute, Outlet } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { SignInPage } from './pages/sign-in'
import { SignUpPage } from './pages/sign-up'
import { useBackgroundColor } from '@/lib/hooks'

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => {
    useBackgroundColor('var(--secondary-background)')
    return (
      <main className="flex justify-center py-10">
        <Outlet />
      </main>
    )
  },
})

export const signInRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/sign-in',
  component: SignInPage,
})

export const signUpRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/sign-up',
  component: SignUpPage,
})

export const authRouteTree = authRoute.addChildren([signInRoute, signUpRoute])
