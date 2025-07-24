import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
import { CardList } from '@/components/card-list'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { TransactionsList } from '@/components/transactions'

export function ProviderHomePage() {
  const { children, transactions, curriculum } = useProviderContext()

  return (
    <div className="p-5">
      {curriculum !== null && (
        <section className="mb-5">
          <Header>Content</Header>
          <WhiteCard>{curriculum.description}</WhiteCard>
        </section>
      )}
      <section className="mb-5">
        <Header>Families</Header>
        <CardList
          items={children.map((child) => (
            <div className="flex justify-between">
              <strong className="text-lg">
                {child.firstName} {child.lastName}
              </strong>
              <Button asChild>
                {/* TODO: Add link */}
                <Link to="/provider/messages">Message Parent</Link>
              </Button>
            </div>
          ))}
        />
      </section>
      <section>
        <Header>Payments</Header>
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
