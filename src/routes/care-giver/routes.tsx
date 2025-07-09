import { Outlet, createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/routes/router'

const careGiverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/care-giver',
  component: () => (
    <div>
      <h1>Care Giver</h1>
      <Outlet />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/',
  component: () => <h2>Care Giver Home</h2>,
})

export const careGiverRouteTree = careGiverRoute.addChildren([homeRoute])

