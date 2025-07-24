import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { ProviderHomePage } from './pages/home'
import { ProviderNavBar } from './components/nav-bar'
import { loadProviderData } from './loader'
import { ProviderWrapper } from './wrapper'

export const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider',
  component: () => (
    <ProviderWrapper>
      <ProviderNavBar />
      <main>
        <Outlet />
      </main>
    </ProviderWrapper>
  ),
  loader: loadProviderData,
})

const homeRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/home',
  component: ProviderHomePage,
})

/* TODO renable when other pages are implemented
const childrenRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/messages',
  component: () => <h2>Messages</h2>,
})

const resourcesRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/activity',
  component: () => <h2>Activity</h2>,
})

const helpRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/resources',
  component: () => <h2>Resources</h2>,
})

const settingsRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/attendance',
  component: () => <h2>Attendance</h2>,
})
*/

export const providerRouteTree = providerRoute.addChildren([
  homeRoute,
  // childrenRoute,
  // resourcesRoute,
  // helpRoute,
  // settingsRoute,
])
