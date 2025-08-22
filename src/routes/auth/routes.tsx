import { createRoute, Outlet } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { SignInPage } from './pages/sign-in'
import { SignUpPage } from './pages/sign-up'
import { useBackgroundColor } from '@/lib/hooks'

function Layout() {
  useBackgroundColor('var(--secondary-background)')
  return (
    <main className="flex justify-center py-10">
      <Outlet />
    </main>
  )
}

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Layout,
})

export const signInRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/sign-in',
  validateSearch: (search: Record<string, unknown>) => {
    const redirect_url = search.redirect_url as string | undefined
    return { redirect_url }
  },
  component: SignInPage,
})

export const signUpRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/sign-up',
  component: SignUpPage,
})

export const authRouteTree = authRoute.addChildren([signInRoute, signUpRoute])
