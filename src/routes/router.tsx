import { Outlet, Router, createRootRoute } from '@tanstack/react-router'
import { NavBar } from '@/components/nav-bar'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { caregiverRouteTree } from './caregiver/routes'
import { familyRouteTree } from './family/routes'
import { FileSliders, Apple, Baby } from 'lucide-react'
import { WhatDoWeCallThisProject } from './admin/what-do-we-call-this-project'
import { useState } from 'react'

export const rootRoute = createRootRoute({
  component: () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false)

    return (
      <Wrapper>
        <WhatDoWeCallThisProject showLeaderboard={showLeaderboard} />
        <NavBar
          links={[
            { to: '/admin', text: 'Admin', Icon: FileSliders },
            { to: '/caregiver', text: 'Care Giver', Icon: Apple },
            { to: '/family', text: 'Family', Icon: Baby },
          ]}
        />
        <button
          className="w-full p-5 text-center text-primary-foreground font-bold"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
        </button>
        <Outlet />
      </Wrapper>
    )
  },
})

export const routeTree = rootRoute.addChildren([
  adminRouteTree,
  caregiverRouteTree,
  familyRouteTree,
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
