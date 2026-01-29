import { TrackableBanner } from '@/components/trackable-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { familyRoute } from '../routes'

const PATHWAYS_BANNER_TRACKING_ID = 'pathways_banner'

export function PathwaysBanner() {
  const t = translations.family.pathwaysBanner
  const context = familyRoute.useRouteContext()

  return (
    <TrackableBanner
      trackingId={PATHWAYS_BANNER_TRACKING_ID}
      link={{ to: '/family/$childId/resources' }}
      context={context}
    >
      <Text text={t.message} />
    </TrackableBanner>
  )
}
