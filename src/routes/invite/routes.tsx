import { LoadingPage } from '@/components/pages/loading-page'
import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { loadProviderInvite, ProviderInvitePage } from './pages/provider'
import { FamilyInvitePage, loadFamilyInvite } from './pages/family'
import { DefaultHeader } from '@/components/default-header'

const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite',
  pendingComponent: LoadingPage,
  component: () => (
    <>
      <DefaultHeader />
      <main>
        <Outlet />
      </main>
    </>
  ),
})

export const providerRoute = createRoute({
  getParentRoute: () => inviteRoute,
  path: '/provider/$inviteId',
  component: ProviderInvitePage,
  loader: loadProviderInvite,
})

export const familyRoute = createRoute({
  getParentRoute: () => inviteRoute,
  path: '/family/$inviteId',
  component: FamilyInvitePage,
  loader: loadFamilyInvite,
})

export const inviteRouteTree = inviteRoute.addChildren([
  providerRoute,
  familyRoute,
])
