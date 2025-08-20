import { paymentRoute } from '@/routes/family/routes'
import { useFamilyContext } from '@/routes/family/wrapper'

import { translations } from '@/translations/text'
import { CalendarPaymentPage } from './calendar-payment/calendar-payment'
import { LumpPaymentPage } from './lump-payment/lump-payment'
import { Text } from '@/translations/wrapper'
import { Header } from '@/components/header'
import { findProviderById } from '@/lib/providers'

export function PaymentPage() {
  const t = translations.family.paymentPage
  const { providerId } = paymentRoute.useParams()
  const { providers } = useFamilyContext()

  const provider = findProviderById(providers, providerId)

  if (!provider) {
    return (
      <div className="flex flex-col items-center gap-8 p-4 min-w-[320px] pb-8">
        <h2 className="text-lg font-semibold">
          <Text text={t.providerNotFound} />
        </h2>
      </div>
    )
  }
  let pageContent = <LumpPaymentPage provider={provider} />

  if (provider.type === 'ffn') {
    pageContent = <CalendarPaymentPage provider={provider} />
  }

  return (
    <div className="flex flex-col items-center p-4 min-w-[320px] pb-8">
      <div className="text-center w-full max-w-md md:max-w-2xl">
        <Header>
          <Text text={t.paymentFor} data={{ providerName: provider?.name }} />
        </Header>
      </div>
      {pageContent}
    </div>
  )
}
