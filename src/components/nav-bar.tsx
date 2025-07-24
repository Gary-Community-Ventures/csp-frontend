import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
  sticky?: boolean
}

export function NavBar({ links, sticky = false }: NavBarProps) {
  return (
    <NavigationMenu
      className={sticky ? 'sticky top-0 z-50 bg-white' : 'bg-white'}
    >
      <NavigationMenuList>
        {links.map(({ Icon, text, ...restLinkProps }) => (
          <NavigationMenuItem key={restLinkProps.to}>
            <NavigationMenuLink asChild>
              <Link
                {...restLinkProps}
                className="h-full transition-none"
                activeProps={{ className: 'border-b-2 mb-0' }}
                inactiveProps={{ className: 'mb-[2px]' }}
              >
                <span className="flex flex-col justify-center items-center md:flex-row md:gap-3">
                  <Icon className="size-5 text-tertiary sm:size-7" />
                  <span className="inline-block">{text}</span>
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
