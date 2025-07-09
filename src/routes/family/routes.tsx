import { NavBar } from '@/components/nav-bar'
import { Outlet, createRoute } from '@tanstack/react-router'
import {
  House,
  Mail,
  HeartHandshake,
  MessageCircleQuestionMark,
  Settings,
} from 'lucide-react'
import { rootRoute } from '@/routes/router'

const familyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/family',
  component: () => (
    <div>
      <main className="pt-10 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <NavBar
        links={[
          { to: '/family', text: 'Home', Icon: House },
          { to: '/family/activity', text: 'Activity', Icon: Mail },
          {
            to: '/family/providers',
            text: 'Providers',
            Icon: HeartHandshake,
          },
          {
            to: '/family/help',
            text: 'Help',
            Icon: MessageCircleQuestionMark,
          },
          { to: '/family/settings', text: 'Settings', Icon: Settings },
        ]}
      />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => familyRoute,
  path: '/',
  component: () => <h2>Family Home</h2>,
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
  component: () => <h2>Family Settings</h2>,
})

export const familyRouteTree = familyRoute.addChildren([
  homeRoute,
  activityRoute,
  providersRoute,
  helpRoute,
  settingsRoute,
])
