import { EnvironmentBanner } from '@/components/ui/environment-banner'
import ErrorFallback from '@/components/error-fallback'

import {
  Outlet,
  Router,
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router'
import { adminRouteTree } from './admin/routes'
import { providerRouteTree } from './provider/routes'
import { familyRouteTree } from './family/routes'
import { authRouteTree } from './auth/routes'
import type { UserResource, GetToken, LoadedClerk } from '@clerk/types'
import { inviteRouteTree } from './invite/routes'
import { NotAuthorizedPage } from '@/components/pages/not-authorized-page'

export type RouterContext = {
  user: UserResource | null
  isSignedIn: boolean
  getToken: GetToken
  clerk: LoadedClerk | null
}

const isUserAuthorized = (user: UserResource): boolean => {
  const types = user.publicMetadata.types
  const hasFamilyId = user.publicMetadata.family_id !== undefined
  const hasProviderId = user.publicMetadata.provider_id !== undefined

  return Array.isArray(types) && (hasFamilyId || hasProviderId)
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <EnvironmentBanner />
        <Outlet />
      </>
    )
  },
  errorComponent: ErrorFallback,
})

export const notAuthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-authorized',
  component: NotAuthorizedPage,
})

export const redirectToProviderOrFamily = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (context.user === null) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect_url: undefined },
      })
    }

    if (!isUserAuthorized(context.user)) {
      // Eventually we will redirect to application once the application is complete
      throw redirect({
        to: '/not-authorized',
      })
    }

    const types = context.user.publicMetadata.types

    if (Array.isArray(types)) {
      if (types.includes('family')) {
        throw redirect({ to: '/family' })
      }
      if (types.includes('provider')) {
        throw redirect({ to: '/provider' })
      }
    }
  },
})

export const routeTree = rootRoute.addChildren([
  redirectToProviderOrFamily,
  adminRouteTree,
  providerRouteTree,
  familyRouteTree,
  authRouteTree,
  inviteRouteTree,
  notAuthorizedRoute,
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
