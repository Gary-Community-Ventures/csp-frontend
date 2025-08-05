import { ChildrenList } from '@/components/children-list'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
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
