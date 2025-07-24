import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
import { CardList } from '@/components/card-list'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { TransactionsList } from '@/components/transactions'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function ProviderHomePage() {
  const t = translations.provider.home
  const { children, transactions, curriculum } = useProviderContext()

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
        <Header>
          <Text text={t.children} />
        </Header>
        <CardList
          items={children.map((child) => (
            <div className="flex justify-between">
              <strong className="text-lg">
                {child.firstName} {child.lastName}
              </strong>
              <Button asChild>
                {/* TODO: Add link */}
                <Link to="/provider/messages">
                  <Text text={t.messageParent} />
                </Link>
              </Button>
            </div>
          ))}
        />
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
