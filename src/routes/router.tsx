import {
  Outlet,
  Router,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { NavBar } from '@/components/nav-bar'
import { Wrapper } from '@/context'
import { adminRouteTree } from './admin/routes'
import { providerRouteTree } from './provider/routes'
import { familyRouteTree } from './family/routes'
import { FileSliders, Apple, Baby } from 'lucide-react'
import { authRouteTree } from './auth/routes'
import { useState } from 'react'
import { WhatDoWeCallThisProject } from './admin/what-do-we-call-this-project'
import type { UserResource, GetToken, LoadedClerk } from '@clerk/types'

export type RouterContext = {
  user: UserResource | null
  isSignedIn: boolean
  getToken: GetToken
  clerk: LoadedClerk | null
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const { whatDoWeCallThisProject } = rootRoute.useSearch()
    const [showLeaderBoard, setShowLeaderBoard] = useState(false)

    return (
      <Wrapper>
        <NavBar
          links={[
            { to: '/admin', text: 'Admin', Icon: FileSliders },
            { to: '/provider/home', text: 'Care Giver', Icon: Apple },
            { to: '/family', text: 'Family', Icon: Baby },
          ]}
        />
        {whatDoWeCallThisProject && (
          <>
            <button
              className="w-full text-center"
              onClick={() => setShowLeaderBoard((prev) => !prev)}
            >
              {showLeaderBoard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
            <WhatDoWeCallThisProject showLeaderboard={showLeaderBoard} />
          </>
        )}
        <Outlet />
      </Wrapper>
    )
  },
  validateSearch: (search: Record<string, unknown>) => {
    if (search['whatDoWeCallThisProject'] === undefined) {
      return {}
    }

    return {
      whatDoWeCallThisProject: true,
    }
  },
  errorComponent: () => <WhatDoWeCallThisProject randomizeColors={false} />,
})

export const routeTree = rootRoute.addChildren([
  adminRouteTree,
  providerRouteTree,
  familyRouteTree,
  authRouteTree,
])

export const router = new Router({
  routeTree,
  context: {
    user: null,
    isSignedIn: false,
    getToken: async () => null,
    clerk: null,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
