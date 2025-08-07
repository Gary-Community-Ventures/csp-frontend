import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { InviteConfirmation } from '@/components/invite-confirmation'
import { translations } from '@/translations/text'

export function InviteFamilyConfirmationPage() {
  const t = translations.provider.inviteFamilyPage.confirmationPage
  const navigate = useNavigate()
  const search = useSearch({
    from: '/provider/families/invite/confirmation',
  })

  useEffect(() => {
    if (!search.email) {
      navigate({ to: '/family/$childId/providers/invite' })
    }
  }, [search, navigate])

  return (
    <InviteConfirmation
      {...search}
      backLinkProps={{ to: '/provider/home' }}
      backLinkText={t.backButton}
    />
  )
}
