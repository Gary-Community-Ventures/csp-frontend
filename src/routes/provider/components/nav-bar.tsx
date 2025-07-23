import {
  Mail,
  Home,
  BookOpen,
  ListChecks,
  ListTodo,
  MessageCircleQuestionMark,
  LogOut,
  UserRound,
  ArrowRightLeft,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { SignOutButton, useClerk, useUser } from '@clerk/clerk-react'
import { useProviderContext } from '../wrapper'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@tanstack/react-router'

export function ProviderNavBar() {
  const { providerInfo, navBar, isAlsoFamily } = useProviderContext()
  const { user, isLoaded, isSignedIn } = useUser()
  const clerk = useClerk()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  if (navBar.hidden) {
    return null
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
              <DropdownMenuGroup>
                {isAlsoFamily && (
                  <DropdownMenuItem asChild>
                    <Link to="/family">
                      <ArrowRightLeft />
                      Go to Family Home
                    </Link>
                  </DropdownMenuItem>
                )}
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
      <div className="flex justify-center items-center p-5 bg-white">
        <strong className="text-3xl text-primary">
          {providerInfo.firstName} {providerInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        links={[
          { to: '/provider/home', text: 'Home', Icon: Home },
          { to: '/provider/messages', text: 'Messages', Icon: Mail },
          { to: '/provider/activity', text: 'Activity', Icon: ListChecks },
          {
            to: '/provider/resources',
            text: 'Resources',
            Icon: BookOpen,
          },
          {
            to: '/provider/attendance',
            text: 'Attendance',
            Icon: ListTodo,
          },
        ]}
      />
    </>
  )
}
