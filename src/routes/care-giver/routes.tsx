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

const careGiverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/care-giver',
  component: () => (
    <div>
      <main className="pt-10 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <NavBar
        links={[
          { to: '/care-giver', text: 'Home', Icon: Home },
          { to: '/care-giver/children', text: 'Children', Icon: Mail },
          { to: '/care-giver/resources', text: 'Resources', Icon: BookOpen },
          {
            to: '/care-giver/help',
            text: 'Help',
            Icon: MessageCircleQuestionMark,
          },
          { to: '/care-giver/settings', text: 'Settings', Icon: Settings },
        ]}
      />
    </div>
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/',
  component: () => <h2>Care Giver Home</h2>,
})

const childrenRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/children',
  component: () => <h2>Children</h2>,
})

const resourcesRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/resources',
  component: () => <h2>Resources</h2>,
})

const helpRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/help',
  component: () => <h2>Help</h2>,
})

const settingsRoute = createRoute({
  getParentRoute: () => careGiverRoute,
  path: '/settings',
  component: () => <h2>Settings</h2>,
})

export const careGiverRouteTree = careGiverRoute.addChildren([
  homeRoute,
  childrenRoute,
  resourcesRoute,
  helpRoute,
  settingsRoute,
])
