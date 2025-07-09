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
import { FileSliders, Apple, Baby } from 'lucide-react'
import WhatDoWeCallThisProject from './admin/what-do-we-call-this-project'

export const rootRoute = createRootRoute({
  component: () => (
    <Wrapper>
      <NavBar
        links={[
          { to: '/admin', text: 'Admin', Icon: FileSliders },
          { to: '/care-giver', text: 'Care Giver', Icon: Apple },
          { to: '/family', text: 'Family', Icon: Baby },
        ]}
      />
      <Outlet />
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
