import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Link, useLocation, type LinkProps } from '@tanstack/react-router'
import { type LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent } from 'react'

type NavBarProps = {
  links: (LinkProps & {
    text: string
    Icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
  })[]
  sticky?: boolean
}

export function NavBar({
  links,
  sticky = false,
}: NavBarProps) {
  const location = useLocation()

  return (
    <NavigationMenu
      className={sticky ? 'sticky top-0 z-50 bg-white' : 'bg-white'}
    >
      <NavigationMenuList>
        {links.map(({ Icon, text, ...restLinkProps }) => (
          <NavigationMenuItem key={restLinkProps.to}>
            <NavigationMenuLink
              asChild
              active={location.pathname === restLinkProps.to}
              className={navigationMenuTriggerStyle()}
            >
              <Link {...restLinkProps} className="h-full">
                <span className="inline-block md:flex md:justify-center md:items-center md:gap-3">
                  <div className="flex justify-center">
                    <Icon className="size-5 text-tertiary sm:size-7" />
                  </div>
                  {text}
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
