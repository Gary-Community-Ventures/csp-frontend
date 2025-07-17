import { Outlet, createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/router'
import {
  Home,
  Mail,
  BookOpen,
  MessageCircleQuestionMark,
  Settings,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'

const caregiverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/caregiver',
  component: () => (
    <div>
      <main>
        <Outlet />
      </main>
      <NavBar
        sticky={true}
        links={[
          { to: '/caregiver', text: 'Home', Icon: Home },
          { to: '/caregiver/children', text: 'Children', Icon: Mail },
          { to: '/caregiver/resources', text: 'Resources', Icon: BookOpen },
          {
            to: '/caregiver/help',
            text: 'Help',
            Icon: MessageCircleQuestionMark,
          },
          { to: '/caregiver/settings', text: 'Settings', Icon: Settings },
        ]}
      />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/',
  component: () => <h2>Care Giver Home</h2>,
})

const childrenRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/children',
  component: () => <h2>Children</h2>,
})

const resourcesRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/resources',
  component: () => <h2>Resources</h2>,
})

const helpRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/help',
  component: () => <h2>Help</h2>,
})

const settingsRoute = createRoute({
  getParentRoute: () => caregiverRoute,
  path: '/settings',
  component: () => <h2>Settings</h2>,
})

export const caregiverRouteTree = caregiverRoute.addChildren([
  homeRoute,
  childrenRoute,
  resourcesRoute,
  helpRoute,
  settingsRoute,
])
