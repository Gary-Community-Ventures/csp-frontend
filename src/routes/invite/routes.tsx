import { LoadingPage } from '@/components/pages/loading-page'
import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { loadProviderInvite, ProviderInvitePage } from './pages/provider'

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

export const providerRoute = createRoute({
  getParentRoute: () => inviteRoute,
  path: '/provider/$inviteId',
  component: ProviderInvitePage,
  loader: loadProviderInvite,
})

export const inviteRouteTree = inviteRoute.addChildren([providerRoute])
