import { LoadingPage } from '@/components/pages/loading-page'
import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { ProviderInvitePage } from './pages/provider'

const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite',
  pendingComponent: LoadingPage,
  component: () => (
    <main>
      <Outlet />
    </main>
  ),
})

const providerRoute = createRoute({
  getParentRoute: () => inviteRoute,
  path: '/provider/$familyId',
  component: ProviderInvitePage,
})

export const inviteRouteTree = inviteRoute.addChildren([providerRoute])
