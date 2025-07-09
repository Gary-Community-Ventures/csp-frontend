import {
  Outlet,
  Router,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import { NavBar } from '@/components/nav-bar'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { careGiverRouteTree } from './care-giver/routes'
import { familyRouteTree } from './family/routes'
import WhatDoWeCallThisProject from './admin/what-do-we-call-this-project'

export const rootRoute = createRootRoute({
  component: () => (
    <Wrapper>
      <NavBar />
      <main className="pt-10 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </Wrapper>
  ),
})

const whatDoWeCallThisProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-do-we-call-this-project',
  component: WhatDoWeCallThisProject,
})

export const routeTree = rootRoute.addChildren([
  adminRouteTree,
  careGiverRouteTree,
  familyRouteTree,
  whatDoWeCallThisProjectRoute,
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
