import { ChildrenList } from '@/components/children-list'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
import { ProviderPaymentsList } from '@/routes/provider/components/payments-list'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function ProviderHomePage() {
  const t = translations.provider.home
  const { children, curriculum, paymentHistory, providerInfo } =
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
        </div>
        <ChildrenList children={children} />
      </section>
      <section>
        <Header>
          <Text text={t.payments} />
        </Header>
        <ProviderPaymentsList
          payments={paymentHistory.payments}
          isPayable={providerInfo.isPayable}
          isPaymentEnabled={providerInfo.isPaymentEnabled}
        />
      </section>
    </div>
  )
}
