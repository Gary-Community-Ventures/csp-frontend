import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

import type { Child } from '@/routes/provider/wrapper'

export type ChildrenListProps = {
  children: Child[]
}

export function ChildrenList({ children }: ChildrenListProps) {
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
          <strong className="text-lg">
            {child.firstName} {child.lastName}
          </strong>
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
