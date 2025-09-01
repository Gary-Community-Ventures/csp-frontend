import { SetPaymentRateForm } from '@/routes/provider/components/set-payment-rate-form'
import { useMatch, useNavigate } from '@tanstack/react-router'
import { useProviderContext } from '../wrapper'
import { setRateRoute } from '../routes'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'

export function SetRatePage() {
  const { childId } = setRateRoute.useParams()
  const navigate = useNavigate()
  const { children } = useProviderContext()
  const { context } = useMatch({ from: '__root__' })

  const child = children.find((child) => child.id === childId)

  if (child === undefined) {
    navigate({ to: '/provider/home' })
    return null
  }

  const createPaymentRate = async (
    halfDayRateCents: number,
    fullDayRateCents: number
  ) => {
    const res = await fetch(backendUrl(`/payment-rates/${child.id}`), {
      method: 'POST',
      headers: await headersWithAuth(context),
      body: JSON.stringify({
        half_day_rate_cents: halfDayRateCents,
        full_day_rate_cents: fullDayRateCents,
      }),
    })

    handleStatusCodes(context, res)
    if (!res.ok) {
      throw new Error(`Failed to set payment rate: ${res.statusText}`)
    }
  }

  return (
    <div className="p-5">
      <SetPaymentRateForm createPaymentRate={createPaymentRate} child={child} />
    </div>
  )
}
