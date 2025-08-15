import type { PropsWithChildren } from 'react'
import { Button } from './ui/button'
import { MoveRight } from 'lucide-react'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Link, type LinkProps } from '@tanstack/react-router'

type NotificationBannerProps = PropsWithChildren<{
  link?: LinkProps
}>

const WRAPPER_CLASSES =
  'flex justify-between items-center gap-2 bg-tertiary text-tertiary-foreground p-2 w-full'
export function Wrapper({ children, link }: NotificationBannerProps) {
  if (link !== undefined) {
    return (
      <Link {...link} className={WRAPPER_CLASSES}>
        {children}
      </Link>
    )
  }
  return <div className={WRAPPER_CLASSES}>{children}</div>
}

export function NotificationBanner({
  link,
  children,
}: NotificationBannerProps) {
  const t = translations.general.banner

  return (
    <Wrapper link={link}>
      <div>
        {link !== undefined ? (
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
