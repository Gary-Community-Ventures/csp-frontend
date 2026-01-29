import type { PropsWithChildren } from 'react'
import { Button } from './ui/button'
import { MoveRight } from 'lucide-react'
import { Link, type LinkProps } from '@tanstack/react-router'

export type PromoBannerVariant = 'pathways'

type PromoBannerProps = PropsWithChildren<{
  variant: PromoBannerVariant
  link?: LinkProps
  onClick?: () => void
}>

const WRAPPER_CLASSES =
  'flex justify-between items-center gap-2 bg-secondary text-secondary-foreground p-2 w-full'

function Wrapper({
  children,
  link,
  onClick,
}: PropsWithChildren<{ link?: LinkProps; onClick?: () => void }>) {
  if (link !== undefined) {
    return (
      <Link {...link} className={WRAPPER_CLASSES} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return <div className={WRAPPER_CLASSES}>{children}</div>
}

export function PromoBanner({ link, children, onClick }: PromoBannerProps) {
  return (
    <Wrapper link={link} onClick={onClick}>
      <div>{children}</div>
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
