import { Header } from '@/components/header'
import { ProviderList } from '../components/providers'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function FamilyProvidersPage() {
  const t = translations.family.providerPage
  return (
    <div>
      <section className="p-5">
        <p className="text-lg">
          <Text text={t.header} />
        </p>
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
                <Text text={t.searchProviders} />
              </strong>
              <Button asChild>
                <Link to="/family/$childId/providers/find-licensed">
                  <Text text={t.searchProvidersButton} />
                </Link>
              </Button>
              <Separator />
              <strong className="text-xl text-center">
                <Text text={t.inviteFfn} />
              </strong>
              <Button>
                <Link to="/family/$childId/providers/invite">
                  <Text text={t.inviteFfnButton} />
                </Link>
              </Button>
            </div>
          </WhiteCard>
        </section>
      </div>
    </div>
  )
}
