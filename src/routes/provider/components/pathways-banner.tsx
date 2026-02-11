import { TrackableBanner } from '@/components/trackable-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { providerRoute } from '../routes'

const PATHWAYS_BANNER_TRACKING_ID = 'pathways_banner'

export function PathwaysBanner() {
  const t = translations.pathways.providerBanner
  const context = providerRoute.useRouteContext()

  return (
    <TrackableBanner
      trackingId={PATHWAYS_BANNER_TRACKING_ID}
      link={{ to: '/provider/resources' }}
      context={context}
    >
      <Text text={t.message} />
    </TrackableBanner>
  )
}
