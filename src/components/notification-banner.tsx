import type { PropsWithChildren } from 'react'
import { Button } from './ui/button'
import { MoveRight } from 'lucide-react'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Link, type LinkProps } from '@tanstack/react-router'

type NotificationBannerProps = PropsWithChildren<{
  link?: LinkProps
  onClick?: () => void
  showActionRequired?: boolean
}>

const WRAPPER_CLASSES =
  'flex justify-between items-center gap-2 bg-secondary text-secondary-foreground p-2 w-full'

function Wrapper({
  children,
  link,
  onClick,
}: NotificationBannerProps) {
  if (link !== undefined) {
    return (
      <Link {...link} className={WRAPPER_CLASSES} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return <div className={WRAPPER_CLASSES}>{children}</div>
}

export function NotificationBanner({
  link,
  children,
  onClick,
  showActionRequired = true,
}: NotificationBannerProps) {
  const t = translations.general.banner

  return (
    <Wrapper link={link} onClick={onClick}>
      <div>
        {link !== undefined && showActionRequired ? (
          <span className="font-bold">
            <Text text={t.actionRequired} />
          </span>
        ) : null}
        {children}
      </div>
      {link === undefined ? null : (
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="translate-y-[2px]"
            asChild
          >
            <span>
              <MoveRight className="size-7" />
            </span>
          </Button>
        </div>
      )}
    </Wrapper>
  )
}
