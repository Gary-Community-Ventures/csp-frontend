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
      className={pinBottom ? 'fixed bottom-0 z-50 bg-white' : undefined}
    >
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.to}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link {...link} className="h-full">
                <span className="inline-block">
                  <div className="flex justify-center">
                    <link.Icon className="size-5 text-black sm:size-7" />
                  </div>
                  {link.text}
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
