import { TrackableBanner } from '@/components/trackable-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { providerRoute } from '../routes'

const BRIGHTWHEEL_BANNER_TRACKING_ID = 'brightwheel_banner'

export function BrightwheelBanner() {
  const t = translations.provider.brightwheelBanner
  const context = providerRoute.useRouteContext()

  return (
    <TrackableBanner
      trackingId={BRIGHTWHEEL_BANNER_TRACKING_ID}
      variant="brightwheel"
      link={{ to: '/provider/resources' }}
      context={context}
    >
      <Text text={t.message} />
    </TrackableBanner>
  )
}
