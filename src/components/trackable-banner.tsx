import type { PropsWithChildren } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LinkProps } from '@tanstack/react-router'
import { PromoBanner, type PromoBannerVariant } from './promo-banner'
import { checkClicked, trackClick } from '@/lib/api/clicks'
import type { RouterContext } from '@/routes/router'

type TrackableBannerProps = PropsWithChildren<{
  trackingId: string
  link: LinkProps
  variant: PromoBannerVariant
  context: RouterContext
}>

export function TrackableBanner({
  trackingId,
  link,
  variant,
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
    <PromoBanner
      variant={variant}
      link={link}
      onClick={() => trackClickMutation.mutate()}
    >
      {children}
    </PromoBanner>
  )
}
