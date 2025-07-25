import { useFamilyContext } from '../wrapper'
import { ProviderList } from '../components/providers'
import { TransactionsList } from '@/components/transactions'
import { Header } from '@/components/header'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'

export function FamilyHomePage() {
  const t = translations.family.home
  const { selectedChildInfo, transactions } = useFamilyContext()
  const { balance } = selectedChildInfo

  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  return (
    <>
      <section>
        <h1 className="p-5 w-full">
          <div className="bg-tertiary-background rounded-3xl w-full p-5">
            <div className="text-sm text-center">
              <Text text={t.balance} />
            </div>
            <div className="text-5xl text-center">{formattedBalance}</div>
          </div>
        </h1>
      </section>
      <div className="px-5">
        <section className="mb-5">
          <Header>
            <Text text={t.providers} />
          </Header>
          <ProviderList />
        </section>
        <section>
          <Header>
            <Text text={t.recentTransactions} />
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
    </>
  )
}
