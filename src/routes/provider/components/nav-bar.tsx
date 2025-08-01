import {
  // Mail,
  // Home,
  // BookOpen,
  // ListChecks,
  // ListTodo,
  MessageCircleQuestionMark,
  LogOut,
  UserRound,
  ArrowRightLeft,
} from 'lucide-react'
// import { NavBar } from '@/components/nav-bar'
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
import { DropdownMenuLanguageSwitcher } from '@/components/dropdown-menu-language-switcher'
import { ExternalLink } from '@/components/external-link'
import {
  Text,
  //useText
} from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function ProviderNavBar() {
  const t = translations.provider.navBar
  // const text = useText()
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
        <Link to="/provider/home">
          <img src="/lala_logo_white.png" className="max-h-15" alt="logo" />
        </Link>
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
                      <Text text={t.menu.familyHome} />
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <ExternalLink href="https://google.com/">
                    {/*TODO: add help link*/}
                    <MessageCircleQuestionMark />
                    <Text text={t.menu.support} />
                  </ExternalLink>
                </DropdownMenuItem>
                <DropdownMenuLanguageSwitcher />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => {
                      clerk.openUserProfile()
                    }}
                  >
                    <UserRound />
                    <Text text={t.menu.yourProfile} />
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild>
                  <SignOutButton>
                    <span>
                      <LogOut />
                      <Text text={t.menu.signOut} />
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
      {/* <NavBar
        sticky={true}
        links={[
          { to: '/provider/home', text: text(t.links.home), Icon: Home },
          {
            to: '/provider/messages',
            text: text(t.links.messages),
            Icon: Mail,
          },
          {
            to: '/provider/activity',
            text: text(t.links.activity),
            Icon: ListChecks,
          },
          {
            to: '/provider/resources',
            text: text(t.links.resources),
            Icon: BookOpen,
          },
          {
            to: '/provider/attendance',
            text: text(t.links.attendance),
            Icon: ListTodo,
          },
        ]}
      /> */}
    </>
  )
}
