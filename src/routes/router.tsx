import { EnvironmentBanner } from '@/components/ui/environment-banner'

import {
  Outlet,
  Router,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { providerRouteTree } from './provider/routes'
import { familyRouteTree } from './family/routes'
import { authRouteTree } from './auth/routes'
import type { UserResource, GetToken, LoadedClerk } from '@clerk/types'

export type RouterContext = {
  user: UserResource | null
  isSignedIn: boolean
  getToken: GetToken
  clerk: LoadedClerk | null
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <Wrapper>
        <EnvironmentBanner />
        <Outlet />
      </Wrapper>
    )
  },
})

export const routeTree = rootRoute.addChildren([
  adminRouteTree,
  providerRouteTree,
  familyRouteTree,
  authRouteTree,
])

export const router = new Router({
  routeTree,
  context: {
    user: null,
    isSignedIn: false,
    getToken: async () => null,
    clerk: null,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
