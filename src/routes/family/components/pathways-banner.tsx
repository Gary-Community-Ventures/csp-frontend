import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PromoBanner } from '@/components/promo-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { checkClicked, trackClick } from '@/lib/api/clicks'
import { familyRoute } from '../routes'

const PATHWAYS_BANNER_TRACKING_ID = 'pathways_banner'

export function PathwaysBanner() {
  const t = translations.family.pathwaysBanner
  const context = familyRoute.useRouteContext()
  const queryClient = useQueryClient()

  const { data: hasClicked, isLoading } = useQuery({
    queryKey: ['clicks', PATHWAYS_BANNER_TRACKING_ID],
    queryFn: () => checkClicked(context, PATHWAYS_BANNER_TRACKING_ID),
    staleTime: Infinity,
  })

  const trackClickMutation = useMutation({
    mutationFn: () =>
      trackClick(context, { trackingId: PATHWAYS_BANNER_TRACKING_ID }),
    onSuccess: () => {
      queryClient.setQueryData(['clicks', PATHWAYS_BANNER_TRACKING_ID], true)
    },
  })

  if (isLoading || hasClicked) {
    return null
  }

  return (
    <PromoBanner
      variant="pathways"
      link={{ to: '/family/$childId/resources' }}
      onClick={() => trackClickMutation.mutate()}
    >
      <Text text={t.message} />
    </PromoBanner>
  )
}
