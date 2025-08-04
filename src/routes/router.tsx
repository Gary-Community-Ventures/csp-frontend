import { calendarRoute } from './calendar/routes';
import { EnvironmentBanner } from '@/components/ui/environment-banner'

import {
  Outlet,
  Router,
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { providerRouteTree } from './provider/routes'
import { familyRouteTree } from './family/routes'
import { authRouteTree } from './auth/routes'
import type { UserResource, GetToken, LoadedClerk } from '@clerk/types'
import { inviteRouteTree } from './invite/routes'

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

export const redirectToProviderOrFamily = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({ to: '/auth/sign-in' })
    }

    const types = context.user.publicMetadata.types

    if (!Array.isArray(types)) {
      throw new Error('User has no types')
    }

    if (types.includes('family')) {
      throw redirect({ to: '/family' })
    }
    if (types.includes('provider')) {
      throw redirect({ to: '/provider' })
    }
  },
})

export const routeTree = rootRoute.addChildren([
  redirectToProviderOrFamily,
  adminRouteTree,
  providerRouteTree,
  familyRouteTree,
  authRouteTree,
  calendarRoute,
  inviteRouteTree,
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
