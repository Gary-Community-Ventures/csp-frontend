import { useFamilyContext } from '../wrapper'
import { CareGiversList } from '../components/caregivers'
import { TransactionsList } from '../components/transactions'

export function FamilyHomePage() {
  const { householdInfo } = useFamilyContext()
  const { balance } = householdInfo

  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  return (
    <>
      <h1 className="p-5 w-full">
        <div className="bg-tertiary rounded-3xl text-tertiary-foreground w-full p-5">
          <div className="text-sm text-center">Your Current Balance:</div>
          <div className="text-5xl text-center">{formattedBalance}</div>
        </div>
      </h1>
      <section className="px-5">
        <h2 className="text-3xl font-bold text-secondary">Your Caregivers</h2>
        <CareGiversList />
        <h2 className="text-3xl font-bold text-secondary mt-10">
          Recent Transactions
        </h2>
        <TransactionsList />
      </section>
    </>
  )
}
