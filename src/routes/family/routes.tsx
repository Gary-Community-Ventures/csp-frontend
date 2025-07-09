import { Outlet, createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/routes/router'

const familyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/family',
  component: () => (
    <div>
      <h1>Family</h1>
      <Outlet />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/',
  component: () => <h2>Family Home</h2>,
})

export const familyRouteTree = familyRoute.addChildren([homeRoute])

