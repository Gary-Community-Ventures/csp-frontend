import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PromoBanner } from '@/components/promo-banner'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { checkLinkClicked, trackLinkClick } from '@/lib/api/clickLink'
import { familyRoute } from '../routes'

const PATHWAYS_LINK_ID = 'pathways_resources'

export function PathwaysBanner() {
  const t = translations.family.pathwaysBanner
  const context = familyRoute.useRouteContext()
  const queryClient = useQueryClient()

  const { data: hasClicked, isLoading } = useQuery({
    queryKey: ['clickLink', PATHWAYS_LINK_ID],
    queryFn: () => checkLinkClicked(context, PATHWAYS_LINK_ID),
    staleTime: Infinity,
  })

  const trackClickMutation = useMutation({
    mutationFn: () => trackLinkClick(context, PATHWAYS_LINK_ID),
    onSuccess: () => {
      queryClient.setQueryData(['clickLink', PATHWAYS_LINK_ID], true)
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
