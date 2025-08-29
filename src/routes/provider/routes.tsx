import { Outlet, createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import { ProviderHomePage } from './pages/home'
import { ProviderNavBar } from './components/nav-bar'
import { loadProviderData } from './loader'
import { ProviderWrapper } from './wrapper'
import { InviteFamilyPage } from './pages/invite-family'
import { InviteFamilyConfirmationPage } from './pages/invite-family-confirmation'
import { AttendancePage, loadAttendance } from './pages/attendance'
import { ResourcesPage } from './pages/resources'
import { SetRatePage } from './pages/set-rate'

export const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => (
    <ProviderWrapper>
      <ProviderNavBar />
      <main>
        <Outlet />
      </main>
    </ProviderWrapper>
  ),
  path: '/provider',
  loader: loadProviderData,
})

export const providerWithoutHomeRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({
      to: '/provider/home',
    })
  },
})

const homeRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/home',
  component: ProviderHomePage,
})

const inviteFamilyRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/families/invite',
  component: InviteFamilyPage,
})

export const inviteFamilyConfirmationRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: 'families/invite/confirmation',
  validateSearch: (search: { email: string; phone: string }) => {
    return search
  },
  component: InviteFamilyConfirmationPage,
})

export const attendanceRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/attendance',
  component: AttendancePage,
  loader: loadAttendance,
})

const resourcesRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/resources',
  component: ResourcesPage,
})

export const setRateRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/set-rate/$childId',
  component: SetRatePage,
  parseParams: (params) => ({
    childId: params.childId,
  }),
})

/* TODO renable when other pages are implemented
const childrenRoute = createRoute({
  getParentRoute: () => providerRoute,
  path: '/messages',
  component: () => <h2>Messages</h2>,
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
  providerWithoutHomeRoute,
  homeRoute,
  inviteFamilyRoute,
  inviteFamilyConfirmationRoute,
  attendanceRoute,
  resourcesRoute,
  setRateRoute,
  // childrenRoute,
  // resourcesRoute,
  // helpRoute,
  // settingsRoute,
])
