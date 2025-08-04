import { Header } from '@/components/header'
import { Text } from '@/translations/wrapper'
import { Button } from '@/components/ui/button'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { WhiteCard } from '@/components/white-card'
import { translations } from '@/translations/text'
import { useEffect } from 'react'

export function InviteProviderConfirmationPage() {
  const t = translations.family.inviteProviderPage.confirmation
  const navigate = useNavigate()
  const search = useSearch({
    from: '/family/$childId/providers/invite/confirmation',
  })

  useEffect(() => {
    if (!search.email || !search.phone) {
      navigate({ to: '/family/$childId/providers/invite' })
    }
  }, [search, navigate])

  return (
    <section className="p-5">
      <Header Tag="h1" className="py-5">
        <Text text={t.header} />
      </Header>
      <WhiteCard className="flex flex-col gap-3 p-5 text-center">
        <p>
          <Text text={t.successMessage} />
        </p>
        <p>
          <span className="font-bold">
            <Text text={t.emailLabel} />:
          </span>{' '}
          {search.email}
        </p>
        <p>
          <span className="font-bold">
            <Text text={t.phoneLabel} />:
          </span>{' '}
          {search.phone}
        </p>
      </WhiteCard>
      <Button className="w-full mt-10" asChild>
        <Link to="/family/$childId/providers">
          <Text text={t.backButton} />
        </Link>
      </Button>
    </section>
  )
}