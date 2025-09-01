import { ChildrenList } from '@/components/children-list'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { useProviderContext } from '../wrapper'
import { ProviderPaymentsList } from '@/components/transactions'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export function ProviderHomePage() {
  const t = translations.provider.home
  const { children, curriculum, maxChildCount, paymentHistory, providerInfo } =
    useProviderContext()

  return (
    <div className="p-5">
      {curriculum !== null && (
        <section className="mb-5">
          <Header>
            <Text text={t.content} />
          </Header>
          <WhiteCard>{curriculum.description}</WhiteCard>
        </section>
      )}
      <section className="mb-5">
        <div className="flex justify-between flex-wrap w-full">
          <Header>
            <Text text={t.children} />
          </Header>
          {maxChildCount - children.length > 0 && (
            <Button variant="linkButton" size="textLarge" asChild>
              <Link to="/provider/families/invite">
                <Plus className="size-6" />
                <Text text={t.inviteFamily} />
              </Link>
            </Button>
          )}
        </div>
        <ChildrenList children={children} />
      </section>
      <section>
        <Header>
          <Text text={t.payments} />
        </Header>
        <ProviderPaymentsList
          payments={paymentHistory.payments}
          isPayable={providerInfo.isPayable}
          isPaymentEnabled={providerInfo.isPaymentEnabled}
        />
      </section>
    </div>
  )
}
