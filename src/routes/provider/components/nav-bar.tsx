import {
  // Mail,
  Home,
  // ListChecks,
  // ListTodo,
  MessageCircleQuestionMark,
  LogOut,
  UserRound,
  ArrowRightLeft,
  CreditCard,
  BookOpen,
  type LucideProps,
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
import { DropdownMenuLanguageSwitcher } from '@/components/dropdown-menu-language-switcher'
import { ExternalLink } from '@/components/external-link'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Logo } from '@/components/logo'
import { NotificationBanner } from '@/components/notification-banner'
import type { ForwardRefExoticComponent } from 'react'

export function ProviderNavBar() {
  const t = translations.provider.navBar
  const text = useText()
  const { providerInfo, navBar, isAlsoFamily } = useProviderContext()
  const { user, isLoaded, isSignedIn } = useUser()
  const clerk = useClerk()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  if (navBar.hidden) {
    return null
  }

  // Build navigation links array conditionally
  const navLinks: Array<{
    to: string
    text: string
    Icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
  }> = [
    { to: '/provider/home', text: text(t.links.home), Icon: Home },
    {
      to: '/provider/payment-settings',
      text: text(t.links.paymentSettings),
      Icon: CreditCard,
    },
  ]

  // Only add resources link for FFN providers
  if (providerInfo.type === 'ffn') {
    navLinks.push({
      to: '/provider/resources',
      text: text(t.links.resources),
      Icon: BookOpen,
    })
  }

  return (
    <>
      <div className="flex justify-between bg-primary text-primary-foreground p-5">
        <Logo to="/provider/home" />
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
                  <ExternalLink href={text(t.menu.supportLinks)}>
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
      <ProviderNotificationBanner notification={navBar.notifications[0]} />
      <div className="flex justify-center items-center p-5 bg-white">
        <strong className="text-3xl text-primary">
          {providerInfo.firstName} {providerInfo.lastName}
        </strong>
      </div>
      <NavBar
        sticky={true}
        // @ts-expect-error - Router types will be regenerated after build
        links={navLinks}
      />
    </>
  )
}

type NotificationBannerRawData = {
  type: 'application_denied' | 'attendance' | 'application_pending'
}

type ProviderNotificationBannerProps = {
  notification?: NotificationBannerRawData
}

function ProviderNotificationBanner({
  notification,
}: ProviderNotificationBannerProps) {
  const t = translations.provider.navBar.notificationBanner

  if (notification === undefined) {
    return null
  }

  if (notification.type === 'application_pending') {
    return (
      <NotificationBanner>
        <Text text={t.applicationPending} />
      </NotificationBanner>
    )
  }

  if (notification.type === 'application_denied') {
    return (
      <NotificationBanner>
        <Text text={t.applicationDenied} />
      </NotificationBanner>
    )
  }

  if (notification.type === 'attendance') {
    return (
      <NotificationBanner link={{ to: '/provider/attendance' }}>
        <Text text={t.attendance} />
      </NotificationBanner>
    )
  }

  return null
}
