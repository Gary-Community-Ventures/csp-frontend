import { Outlet, createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/routes/router'

import { BackendTestPage } from './pages/backendTest'

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
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
  component: () => <h2>Admin Home</h2>,
})

const backendTestPage = createRoute({
  getParentRoute: () => adminRoute,
  path: '/backend-test',
  component: () => <BackendTestPage />,
})

export const adminRouteTree = adminRoute.addChildren([
  homeRoute,
  backendTestPage,
])
