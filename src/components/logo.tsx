import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'

export function Logo({ to }: { to: string }) {
  const isMobile = useIsMobile()

  return (
    <Link to={to}>
      <img
        src={isMobile ? "/cap_circle_logo_white.png" : "/cap_full_logo_white.png"}
        className="max-h-12"
        alt="logo"
      />
    </Link>
  )
}
