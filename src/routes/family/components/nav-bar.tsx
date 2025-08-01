import {
  House,
  //  Mail,
  HeartHandshake,
  //  ListChecks,
  MessageCircleQuestionMark,
  LogOut,
  UserRound,
  ArrowRightLeft,
} from 'lucide-react'
import { NavBar } from '@/components/nav-bar'
import { useFamilyContext } from '../wrapper'
import { Link, useNavigate } from '@tanstack/react-router'
import { SignOutButton, useClerk, useUser } from '@clerk/clerk-react'
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
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { DropdownMenuLanguageSwitcher } from '@/components/dropdown-menu-language-switcher'
import { ExternalLink } from '@/components/external-link'

export function FamilyNavBar() {
  const t = translations.family.navBar
  const text = useText()
  const { selectedChildInfo, navBar, children, isAlsoProvider } =
    useFamilyContext()
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
        <Link to="/family/$childId/home">
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
              <DropdownMenuLabel>
                <Text text={t.menu.selectedChild} />
              </DropdownMenuLabel>
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
                {isAlsoProvider && (
                  <DropdownMenuItem asChild>
                    <Link to="/provider/home">
                      <ArrowRightLeft />
                      <Text text={t.menu.providerHome} />
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
              text: text(t.links.home),
              Icon: House,
            },
            /* TODO renable when messages/activity are implemented
            {
              to: '/family/$childId/messages',
              text: text(t.links.messages),
              Icon: Mail,
            },
            {
              to: '/family/$childId/activity',
              text: text(t.links.activity),
              Icon: ListChecks,
            },
            */
            {
              to: '/family/$childId/providers',
              text: text(t.links.providers),
              Icon: HeartHandshake,
            },
          ]}
        />
      )}
    </>
  )
}
