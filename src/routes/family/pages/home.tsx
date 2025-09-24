import { useFamilyContext } from '../wrapper'
import { ProviderList } from '../components/providers'
import { FamilyPaymentsList } from '@/routes/family/components/payments-list'
import { Header } from '@/components/header'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'
import { formatAmount } from '@/lib/currency'
import { useCurrentMonthBalance } from '@/lib/hooks'
import { familyRoute } from '../routes'
import { useMemo } from 'react'

function Balance() {
  const t = translations.family.home
  const { selectedChildInfo } = useFamilyContext()
  const context = familyRoute.useRouteContext()
  const balance = useCurrentMonthBalance(context, selectedChildInfo.id)

  const currentMonth = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString('en', { month: 'long' })
  }, [])

  return (
    <section>
      {balance !== undefined && (
        <h1 className="px-5 pt-5 w-full">
          <div className="bg-tertiary-background rounded-3xl w-full p-5">
            <div className="text-sm text-center">
              <Text text={t.balance} data={{ month: currentMonth }} />
            </div>
            <div className="text-5xl text-center">{formatAmount(balance)}</div>
          </div>
        </h1>
      )}
    </section>
  )
}

export function FamilyHomePage() {
  const t = translations.family.home
  const { selectedChildInfo, paymentHistory } = useFamilyContext()
  const filteredPayments = useMemo(
    () =>
      paymentHistory.payments.filter(
        (payment) => payment.child_supabase_id === selectedChildInfo.id
      ),
    [paymentHistory.payments, selectedChildInfo.id]
  )

  return (
    <>
      {selectedChildInfo.isPaymentEnabled ? <Balance /> : null}
      <div className="px-5 pt-5">
        <section className="mb-5">
          <Header>
            <Text text={t.providers} />
          </Header>
          <ProviderList showAddProvider={true} />
        </section>
        <section>
          <Header>
            <Text text={t.recentTransactions} />
          </Header>
          <FamilyPaymentsList payments={filteredPayments} />
        </section>
      </div>
    </>
  )
}
