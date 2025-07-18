import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { CaregiverHomePage } from './pages/home'
import { CaregiverNavBar } from './components/nav-bar'
import { loadCaregiverData } from './loader'
import { CaregiverWrapper } from './wrapper'

export const caregiverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/caregiver',
  component: () => (
    <CaregiverWrapper>
      <CaregiverNavBar />
      <main>
        <Outlet />
      </main>
    </CaregiverWrapper>
  ),
  loader: loadCaregiverData,
})

const homeRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/',
  component: CaregiverHomePage,
})

const childrenRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/messages',
  component: () => <h2>Messages</h2>,
})

const resourcesRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/activity',
  component: () => <h2>Activity</h2>,
})

const helpRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/resources',
  component: () => <h2>Resources</h2>,
})

const settingsRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/attendance',
  component: () => <h2>Attendance</h2>,
})

export const caregiverRouteTree = caregiverRoute.addChildren([
  homeRoute,
  childrenRoute,
  resourcesRoute,
  helpRoute,
  settingsRoute,
])
