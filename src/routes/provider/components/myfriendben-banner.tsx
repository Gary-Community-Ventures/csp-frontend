import { TrackableBanner } from '@/components/trackable-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { providerRoute } from '../routes'

const MYFRIENDBEN_BANNER_TRACKING_ID = 'myfriendben_banner'

export function MyFriendBenBanner() {
  const t = translations.myFriendBen.providerBanner
  const context = providerRoute.useRouteContext()

  return (
    <TrackableBanner
      trackingId={MYFRIENDBEN_BANNER_TRACKING_ID}
      link={{ to: '/provider/resources', hash: 'myfriendben' }}
      context={context}
    >
      <Text text={t.message} />
    </TrackableBanner>
  )
}
