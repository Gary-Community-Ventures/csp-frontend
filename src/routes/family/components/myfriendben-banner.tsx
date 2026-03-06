import { TrackableBanner } from '@/components/trackable-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { familyRoute } from '../routes'
import { useFamilyContext } from '../wrapper'

const MYFRIENDBEN_BANNER_TRACKING_ID = 'myfriendben_banner'

export function MyFriendBenBanner() {
  const t = translations.myFriendBen.familyBanner
  const context = familyRoute.useRouteContext()
  const { selectedChildInfo } = useFamilyContext()

  return (
    <TrackableBanner
      trackingId={MYFRIENDBEN_BANNER_TRACKING_ID}
      link={{
        to: '/family/$childId/resources',
        params: { childId: selectedChildInfo.id },
        hash: 'myfriendben',
      }}
      context={context}
    >
      <Text text={t.message} />
    </TrackableBanner>
  )
}
