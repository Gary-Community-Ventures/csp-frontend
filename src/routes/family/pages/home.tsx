import { useFamilyContext } from '../wrapper'
import { CaregiversList } from '../components/caregivers'
import { TransactionsList } from '@/components/transactions'
import { Header } from '@/components/header'

export function FamilyHomePage() {
  const { householdInfo, transactions } = useFamilyContext()
  const { balance } = householdInfo

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
            <div className="text-sm text-center">Your Current Balance:</div>
            <div className="text-5xl text-center">{formattedBalance}</div>
          </div>
        </h1>
      </section>
      <div className="px-5">
        <section className="mb-5">
          <Header>Your Caregivers</Header>
          <CaregiversList />
        </section>
        <section>
          <Header>Recent Transactions</Header>
          <TransactionsList
            transactions={transactions.map((transaction) => {
              return {
                name: transaction.provider,
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
