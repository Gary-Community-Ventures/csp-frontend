import { useFamilyContext } from '../wrapper'
import { CareGiversList } from '../components/caregivers'
import { TransactionsList } from '../components/transactions'

export function FamilyHomePage() {
  const { householdInfo } = useFamilyContext()
  const { firstName, lastName, balance } = householdInfo

  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  return (
    <>
      <div className="h-52 p-5 bg-primary relative mb-15">
        <div className="text-primary-foreground">
          <div className="text-lg">Welcome back,</div>
          <div className="text-4xl">
            <strong>
              {firstName} {lastName}
            </strong>
          </div>
        </div>
        <h1 className="absolute bottom-0 left-0 p-5 w-full">
          <div className="bg-secondary rounded-3xl translate-y-1/2 text-secondary-foreground font-bold w-full p-5">
            <div className="text-sm text-center">Your Current Balance:</div>
            <div className="text-5xl text-center">{formattedBalance}</div>
          </div>
        </h1>
      </div>
      <section className="px-5">
        <h2 className="text-3xl font-bold text-title-foreground">
          Your Caregivers
        </h2>
        <CareGiversList />
        <h2 className="text-3xl font-bold text-title-foreground mt-10">
          Recent Transactions
        </h2>
        <TransactionsList />
      </section>
    </>
  )
}
