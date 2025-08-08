import { Link, type LinkProps } from '@tanstack/react-router'
import { useIsMobile } from '@/lib/is-mobile'
import { useMemo } from 'react'

type LogoVariant = 'color' | 'white'
type LogoProps = { variant?: LogoVariant } & LinkProps

const LOGO_PATHS: Record<LogoVariant, { desktop: string; mobile: string }> = {
  color: {
    desktop: '/cap_full_logo_color.png',
    mobile: '/cap_full_logo_color.png',
  },
  white: {
    desktop: '/cap_full_logo_white.png',
    mobile: '/cap_circle_logo_white.png',
  },
}

export function Logo({ variant = 'white', ...rest }: LogoProps) {
  const isMobile = useIsMobile()

  const logoPath = useMemo(() => {
    const variantPath = LOGO_PATHS[variant]

    return isMobile ? variantPath.mobile : variantPath.desktop
  }, [variant, isMobile])

  return (
    <Link {...rest}>
      <img src={logoPath} className="max-h-8" alt="logo" />
    </Link>
  )
}
