import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import type { Child } from '@/routes/provider/wrapper'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { formatAmount } from '@/lib/currency'
import { Separator } from './ui/separator'

export type ChildrenListProps = {
  children: Child[]
}

export function ChildrenList({ children }: ChildrenListProps) {
  const t = translations.provider.home.childrenList

  if (children.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
          <p className="text-lg font-semibold mb-2">
            <Text text={translations.general.emptyState.noChildrenTitle} />
          </p>
          <p className="text-sm">
            <Text
              text={translations.general.emptyState.noChildrenDescription}
            />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={children.map((child) => (
        <div className="flex justify-between">
          <strong className="text-lg flex items-center">
            {child.firstName} {child.lastName}
          </strong>
          {child.fullDayRateCents === null ? (
            <Button asChild>
              <Link
                to="/provider/set-rate/$childId"
                params={{ childId: child.id }}
              >
                <Text text={t.setRate} />
              </Link>
            </Button>
          ) : (
            <span>
              <div>
                <span className="font-bold text-primary">
                  <Text text={t.halfDayRate} />
                </span>
                {formatAmount(child.halfDayRateCents)}
              </div>
              <div>
                <span className="font-bold text-primary">
                  <Text text={t.fullDayRate} />
                </span>
                {formatAmount(child.fullDayRateCents)}
              </div>
            </span>
          )}
          {/* TODO enable when messages are implemented */}
          {/*<Button asChild>
            <Link to="/provider/messages">
              <Text text={t.messageParent} />
            </Link>
          </Button>*/}
        </div>
      ))}
    />
  )
}
