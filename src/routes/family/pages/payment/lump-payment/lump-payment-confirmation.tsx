import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Text, useLanguageContext } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { lumpPaymentConfirmationRoute } from '@/routes/family/routes'
import { formatAmount } from '@/lib/currency'
import { Header } from '@/components/header'
import { formatMonthForDisplay } from '@/lib/date-utils'

export function LumpSumConfirmationPage() {
  const t = translations.family.lumpSumConfirmationPage
  const { providerName, childName, month, hours, amount } =
    lumpPaymentConfirmationRoute.useSearch()
  const { childId } = lumpPaymentConfirmationRoute.useParams()
  const { lang } = useLanguageContext()

  const formattedAmount = formatAmount(parseFloat(amount) * 100)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div className="text-center">
        <Header Tag="h1" className="text-2xl font-bold">
          <Text text={t.header} />
        </Header>
        <p className="text-lg">
          <Text text={t.successMessage} />
        </p>
      </div>
      <div className="p-6 border rounded-md w-full max-w-md bg-white shadow-xs">
        <div className="flex justify-between py-2 border-b">
          <span className="font-semibold">
            <Text text={t.providerLabel} />
          </span>
          <span>{providerName}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-semibold">
            <Text text={t.childLabel} />
          </span>
          <span>{childName}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-semibold">
            <Text text={t.monthLabel} />
          </span>
          <span>{formatMonthForDisplay(month, lang)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="font-semibold">
            <Text text={t.hoursLabel} />
          </span>
          <span>{hours}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-semibold">
            <Text text={t.amountLabel} />
          </span>
          <span>{formattedAmount}</span>
        </div>
      </div>
      <Link to="/family/$childId/home" params={{ childId }}>
        <Button>
          <Text text={t.backButton} />
        </Button>
      </Link>
    </div>
  )
}
