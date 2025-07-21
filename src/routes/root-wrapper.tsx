import { Outlet, useSearch } from '@tanstack/react-router'
import { NavBar } from '@/components/nav-bar'
import { Wrapper } from '@/context'
import { FileSliders, Apple, Baby } from 'lucide-react'
import { useState } from 'react'
import { WhatDoWeCallThisProject } from './admin/what-do-we-call-this-project'

export function RootWrapper() {
  const { whatDoWeCallThisProject } = useSearch({from: '__root__'})
  const [showLeaderBoard, setShowLeaderBoard] = useState(false)

  return (
    <Wrapper>
      <NavBar
        links={[
          { to: '/admin', text: 'Admin', Icon: FileSliders },
          { to: '/provider', text: 'Care Giver', Icon: Apple },
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
}
