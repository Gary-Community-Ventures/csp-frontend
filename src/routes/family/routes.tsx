import { Outlet, createRoute, useLocation } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { FamilyHomePage } from './pages/home'
import { FamilyWrapper } from './wrapper'
import { loadFamilyData } from './loader'
import { FamilyNavBar } from './components/nav-bar'
import { FamilyHeader } from './components/family-header';
import { FamilyProvidersPage } from './pages/providers';
import PaymentPage from './pages/payment/payment';
import ReviewPage from './pages/payment/review';
import ConfirmationPage from './pages/payment/confirmation';

export const familyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/family',
  component: () => {
    const location = useLocation();
    const hideNavBar = location.pathname.startsWith('/family/payment');

    return (
      <FamilyWrapper>
        <div className="flex flex-col h-full">
          <FamilyHeader />
          {!hideNavBar && <FamilyNavBar />}
          <main className="flex-grow h-full">
            <Outlet />
          </main>
        </div>
      </FamilyWrapper>
    );
  },
  loader: loadFamilyData,
});

const homeRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/',
  component: FamilyHomePage,
});

const activityRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/activity',
  component: () => <h2>Family Activity</h2>,
});

const providersRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/providers',
  component: FamilyProvidersPage,
});

const helpRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/messages',
  component: () => <h2>Messages</h2>,
});

const settingsRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/settings',
  component: () =>
    Array.from({ length: 100 }).map((_, i) => <h2 key={i}>Family Settings</h2>),
});

import { PaymentFlowProvider } from './pages/payment/context';

// ... (rest of the imports)

const paymentRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/payment',
  validateSearch: (search: { providerId?: string }) => search,
  component: () => (
    <PaymentFlowProvider>
      <Outlet />
    </PaymentFlowProvider>
  ),
});

const paymentIndexRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/',
  component: PaymentPage,
});

const reviewRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/review',
  component: ReviewPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => paymentRoute,
  path: '/confirmation',
  component: ConfirmationPage,
});

const paymentRouteTree = paymentRoute.addChildren([
  paymentIndexRoute,
  reviewRoute,
  confirmationRoute,
]);

export const familyRouteTree = familyRoute.addChildren([
  homeRoute,
  activityRoute,
  providersRoute,
  helpRoute,
  settingsRoute,
  paymentRouteTree,
]);
