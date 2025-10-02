import { Header } from '@/components/header'
import { ProviderList } from '../components/providers'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { ExternalLink } from '@/components/external-link'
import { COLORADO_SHINES_URL } from '@/lib/constants'

export function FamilyProvidersPage() {
  const t = translations.family.providerPage
  return (
    <div>
      <section className="p-5">
        <div className="text-lg space-y-4 text-center">
          <p>
            <Text text={t.header.main} />
          </p>
          <p>
            <Text text={t.header.knownProvider.part1} />
            <ExternalLink
              href="https://www.capcolorado.org/en/providers"
              className="text-primary hover:text-primary/80 underline"
            >
              <Text text={t.header.knownProvider.linkText} />
            </ExternalLink>
            <Text text={t.header.knownProvider.part2} />
          </p>
          <p>
            <Text text={t.header.newProvider.part1} />
            <ExternalLink
              href={COLORADO_SHINES_URL}
              className="text-primary hover:text-primary/80 underline"
            >
              <Text text={t.header.newProvider.coloradoShinesText} />
            </ExternalLink>
            <Text text={t.header.newProvider.part2} />
          </p>
        </div>
      </section>
      <div className="flex flex-col lg:flex-row">
        <section className="p-5 flex-1">
          <Header>
            <Text text={t.yourProviders} />
          </Header>
          <ProviderList />
        </section>
        <section className="p-5 flex-1">
          <Header>
            <Text text={t.addProvider} />
          </Header>
          <WhiteCard>
            <div className="flex gap-5 items-center justify-center flex-col">
              <strong className="text-xl text-center">
                <Text text={t.invite} />
              </strong>
              <Button>
                <Link to="/family/$childId/providers/invite">
                  <Text text={t.inviteButton} />
                </Link>
              </Button>
            </div>
          </WhiteCard>
        </section>
      </div>
    </div>
  )
}
