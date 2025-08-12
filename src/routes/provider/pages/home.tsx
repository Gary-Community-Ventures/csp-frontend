import { ChildrenList } from '@/components/children-list'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
import { TransactionsList } from '@/components/transactions'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export function ProviderHomePage() {
  const t = translations.provider.home
  const { children, transactions, curriculum, maxChildCount } =
    useProviderContext()

  return (
    <div className="p-5">
      {curriculum !== null && (
        <section className="mb-5">
          <Header>
            <Text text={t.content} />
          </Header>
          <WhiteCard>{curriculum.description}</WhiteCard>
        </section>
      )}
      <section className="mb-5">
        <div className="flex justify-between flex-wrap w-full">
          <Header>
            <Text text={t.children} />
          </Header>
          {maxChildCount - children.length > 0 && (
            <Button variant="link" size="textLarge" asChild>
              <Link to="/provider/families/invite">
                <Plus className="size-6" />
                <Text text={t.inviteFamily} />
              </Link>
            </Button>
          )}
        </div>
        <ChildrenList children={children} />
      </section>
      <section>
        <Header>
          <Text text={t.payments} />
        </Header>
        <TransactionsList
          transactions={transactions.map((transaction) => {
            return {
              name: transaction.name,
              amount: transaction.amount,
              date: transaction.date,
            }
          })}
        />
      </section>
    </div>
  )
}
