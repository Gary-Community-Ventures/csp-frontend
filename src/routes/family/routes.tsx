import { Outlet, createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { FamilyHomePage } from './pages/home'
import { FamilyWrapper } from './wrapper'
import { loadFamilyData, redirectToDefaultId } from './loader'
import { FamilyNavBar } from './components/nav-bar'
import { FamilyProvidersPage } from './pages/providers';
import { PaymentPage } from './payment/page'

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
  context: ({ context }) => ({ context }),
});

const homeRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/home',
  component: FamilyHomePage,
});

const providersRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/providers',
  component: FamilyProvidersPage,
});

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
});

export const paymentRoute = createRoute({
  getParentRoute: () => familyWithIdRoute,
  path: '/payment/$providerId',
  component: PaymentPage,
  parseParams: (params) => ({
    providerId: Number(params.providerId),
  }),
});

export const familyWithIdRouteTree = familyWithIdRoute.addChildren([
  homeRoute,
  /* TODO renable when messages/activity are implemented
  activityRoute,
  messagesRoute,
  */
  providersRoute,
  settingsRoute,
  paymentRoute,
])

export const familyRouteTree = familyRoute.addChildren([
  familyWithIdRouteTree,
  familyWithoutIdRoute,
])
