import type { PropsWithChildren } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LinkProps } from '@tanstack/react-router'
import { NotificationBanner } from './notification-banner'
import { checkClicked, trackClick } from '@/lib/api/clicks'
import type { RouterContext } from '@/routes/router'

type TrackableBannerProps = PropsWithChildren<{
  trackingId: string
  link: LinkProps
  context: RouterContext
}>

export function TrackableBanner({
  trackingId,
  link,
  context,
  children,
}: TrackableBannerProps) {
  const queryClient = useQueryClient()

  const { data: hasClicked, isLoading } = useQuery({
    queryKey: ['clicks', trackingId],
    queryFn: () => checkClicked(context, trackingId),
    staleTime: Infinity,
  })

  const trackClickMutation = useMutation({
    mutationFn: () => trackClick(context, { trackingId }),
    onSuccess: () => {
      queryClient.setQueryData(['clicks', trackingId], true)
    },
  })

  if (isLoading || hasClicked) {
    return null
  }

  return (
    <NotificationBanner
      link={link}
      onClick={() => trackClickMutation.mutate()}
      showActionRequired={false}
    >
      {children}
    </NotificationBanner>
  )
}
