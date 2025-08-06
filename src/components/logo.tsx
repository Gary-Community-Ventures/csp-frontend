import { Link, type LinkProps } from '@tanstack/react-router'
import { useIsMobile } from '@/lib/is-mobile'

export function Logo(props: LinkProps) {
  const isMobile = useIsMobile()

  return (
    <Link {...props}>
      <img
        src={isMobile ? "/cap_circle_logo_white.png" : "/cap_full_logo_white.png"}
        className="max-h-8"
        alt="logo"
      />
    </Link>
  )
}
