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
}

export function NavBar({ links }: NavBarProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.to}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link {...link} className='h-15'>
                <span className="inline-block">
                  <div className="flex justify-center">
                    <link.Icon className="size-7 text-black" />
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
