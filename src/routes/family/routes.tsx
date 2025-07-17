import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { FamilyHomePage } from './pages/home'
import { FamilyWrapper } from './wrapper'
import { loadFamilyData } from './family-data'
import { FamilyNavBar } from './components/nav-bar'

export const familyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/family',
  component: () => (
    <FamilyWrapper>
      <FamilyNavBar />
      <main>
        <Outlet />
      </main>
    </FamilyWrapper>
  ),
  loader: loadFamilyData,
})

const homeRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/',
  component: FamilyHomePage,
})

const activityRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/activity',
  component: () => <h2>Family Activity</h2>,
})

const providersRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/providers',
  component: () => <h2>Family Providers</h2>,
})

const helpRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/help',
  component: () => <h2>Family Help</h2>,
})

const settingsRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/settings',
  component: () =>
    Array.from({ length: 100 }).map((_, i) => <h2 key={i}>Family Settings</h2>),
})

export const familyRouteTree = familyRoute.addChildren([
  homeRoute,
  activityRoute,
  providersRoute,
  helpRoute,
  settingsRoute,
])
