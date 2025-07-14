import { Outlet, Router, createRootRoute } from '@tanstack/react-router'
import { NavBar } from '@/components/nav-bar'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { caregiverRouteTree } from './caregiver/routes'
import { familyRouteTree } from './family/routes'
import { FileSliders, Apple, Baby } from 'lucide-react'

export const rootRoute = createRootRoute({
  component: () => (
    <Wrapper>
      <NavBar
        links={[
          { to: '/admin', text: 'Admin', Icon: FileSliders },
          { to: '/caregiver', text: 'Care Giver', Icon: Apple },
          { to: '/family', text: 'Family', Icon: Baby },
        ]}
      />
      <Outlet />
    </Wrapper>
  ),
})

export const routeTree = rootRoute.addChildren([
  adminRouteTree,
  caregiverRouteTree,
  familyRouteTree,
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
