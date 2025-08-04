import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { FamilyHomePage } from './pages/home'
import { FamilyWrapper } from './wrapper'
import { loadFamilyData, redirectToDefaultId } from './loader'
import { FamilyNavBar } from './components/nav-bar'
import { FamilyProvidersPage } from './pages/providers'
import PaymentPage from './pages/payment/payment'
import ReviewPage from './pages/payment/review'
import ConfirmationPage from './pages/payment/confirmation'
import { PaymentFlowProvider } from './pages/payment/context'
import FindProviderPage, { loadProviders } from './pages/find-provider'
import { InviteProviderPage } from './pages/invite-provider'
import { InviteProviderConfirmationPage } from './pages/invite-provider-confirmation'

export const familyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/family',
})

export const familyWithoutIdRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/',
  beforeLoad: redirectToDefaultId,
})

export const familyWithIdRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/$childId',
  component: () => (
    <FamilyWrapper>
      <FamilyNavBar />
      <main className="h-full">
        <Outlet />
      </main>
    </FamilyWrapper>
  ),
  loader: loadFamilyData,
})

const homeRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/home',
  component: FamilyHomePage,
})

const providersRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/providers',
  component: FamilyProvidersPage,
})

/* TODO renable when messages/activity are implemented
const activityRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/activity',
  component: () => <h2>Family Activity</h2>,
})

const messagesRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/messages',
  component: () => <h2>Messages</h2>,
})
*/

const settingsRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/settings',
  component: () =>
    Array.from({ length: 100 }).map((_, i) => <h2 key={i}>Family Settings</h2>),
})

const paymentRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/payment',
  validateSearch: (search: { providerId?: number }) => search,
  component: () => (
    <PaymentFlowProvider>
      <Outlet />
    </PaymentFlowProvider>
  ),
})

const paymentIndexRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/',
  component: PaymentPage,
})

const reviewRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/review',
  component: ReviewPage,
})

const confirmationRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/confirmation',
  component: ConfirmationPage,
})

export const findProviderRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: 'providers/find-licensed',
  component: FindProviderPage,
  loader: loadProviders,
})

export const inviteProviderRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: 'providers/invite',
  component: InviteProviderPage,
})

export const inviteProviderConfirmationRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: 'providers/invite/confirmation',
  validateSearch: (search: { email: string; phone: string }) => {
    return search
  },
  component: InviteProviderConfirmationPage,
})

const paymentRouteTree = paymentRoute.addChildren([
  paymentIndexRoute,
  reviewRoute,
  confirmationRoute,
])

export const familyWithIdRouteTree = familyWithIdRoute.addChildren([
  homeRoute,
  /* TODO renable when messages/activity are implemented
  activityRoute,
  messagesRoute,
  */
  providersRoute,
  settingsRoute,
  paymentRouteTree,
  findProviderRoute,
  inviteProviderRoute,
  inviteProviderConfirmationRoute,
])

export const familyRouteTree = familyRoute.addChildren([
  familyWithIdRouteTree,
  familyWithoutIdRoute,
])
