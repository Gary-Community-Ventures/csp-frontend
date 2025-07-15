import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Link, type LinkProps } from '@tanstack/react-router'
import { type LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent } from 'react'

type NavBarProps = {
  links: (LinkProps & {
    text: string
    Icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
  })[]
  pinBottom?: boolean
}

export function NavBar({ links, pinBottom = false }: NavBarProps) {
  return (
    <NavigationMenu
      className={pinBottom ? 'fixed bottom-0 z-50 bg-white' : 'bg-white'}
    >
      <NavigationMenuList>
        {links.map(({ Icon, text, ...restLinkProps }) => (
          <NavigationMenuItem key={restLinkProps.to}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link {...restLinkProps} className="h-full">
                <span className="inline-block">
                  <div className="flex justify-center">
                    <Icon className="size-5 text-black sm:size-7" />
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
