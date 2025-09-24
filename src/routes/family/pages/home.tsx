import { useFamilyContext } from '../wrapper'
import { ProviderList } from '../components/providers'
import { FamilyPaymentsList } from '@/routes/family/components/payments-list'
import { BalanceCarousel } from '../components/balance-carousel'
import { Header } from '@/components/header'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'
import { useMemo } from 'react'

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
      {selectedChildInfo.isPaymentEnabled ? <BalanceCarousel /> : null}
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
