import {
  House,
  //  Mail,
  HeartHandshake,
  //  ListChecks,
  MessageCircleQuestionMark,
  LogOut,
  UserRound,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { useFamilyContext } from '../wrapper'
import { useNavigate } from '@tanstack/react-router'
import {
  SignOutButton,
  useClerk,
  //  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Link } from '@tanstack/react-router'

export function FamilyNavBar() {
  const { selectedChildInfo, navBar, children } = useFamilyContext()
  const navigate = useNavigate()
  const clerk = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  const changeChild = (id: string) => {
    navigate({ from: '/family/$childId/home', params: { childId: Number(id) } })
  }

  return (
    <>
      <div className="flex justify-between bg-primary text-primary-foreground p-5">
        <img src="/logo.png" className="max-h-15" alt="logo" />
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.imageUrl} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Child</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={String(selectedChildInfo.id)}
                onValueChange={changeChild}
              >
                {children.map((child) => (
                  <DropdownMenuRadioItem
                    value={String(child.id)}
                    key={child.id}
                  >
                    {child.firstName} {child.lastName}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <a href="https://google.com/" target="_blank" rel="noopener">
                    {/*TODO: add help link*/}
                    <MessageCircleQuestionMark />
                    Help/Support
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => {
                      clerk.openUserProfile()
                    }}
                  >
                    <UserRound />
                    Your Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild>
                  <SignOutButton>
                    <span>
                      <LogOut />
                      Sign Out
                    </span>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {navBar.hidden ? (
        <div className="w-full bg-primary p-5 pt-0 flex justify-center items-center">
          <Link to="/family/$childId/home">
            <strong className="text-3xl text-white">
              {selectedChildInfo.firstName} {selectedChildInfo.lastName}
            </strong>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center items-center p-5 bg-white">
          <Link to="/family/$childId/home">
            <strong className="text-3xl text-primary">
              {selectedChildInfo.firstName} {selectedChildInfo.lastName}
            </strong>
          </Link>
        </div>
      )}
      {navBar.hidden ? null : (
        <NavBar
          sticky={true}
          links={[
            {
              to: '/family/$childId/home',
              text: 'Home',
              Icon: House,
            },
            /* TODO renable when messages/activity are implemented
          {
            to: '/family/$childId/messages',
            text: 'Messages',
            Icon: Mail,
          },
          {
            to: '/family/$childId/activity',
            text: 'Activity',
            Icon: ListChecks,
          },
          */
            {
              to: '/family/$childId/providers',
              text: 'Providers',
              Icon: HeartHandshake,
            },
          ]}
        />
      )}
    </>
  )
}
