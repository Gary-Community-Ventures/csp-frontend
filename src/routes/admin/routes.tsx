import { LoadingPage } from '@/components/pages/loading-page';
import { ErrorComponent } from './components/error';
import { Outlet, createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/routes/router'
import { SignOutButton } from '@clerk/clerk-react'

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  pendingComponent: LoadingPage,
  errorComponent: ErrorComponent,
  component: () => (
    <div>
      <h1>Admin</h1>
      <Outlet />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: () => <SignOutButton />,
})

export const adminRouteTree = adminRoute.addChildren([
  homeRoute,
])
