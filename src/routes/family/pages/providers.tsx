import { Header } from '@/components/header'
import { ProviderList } from '../components/providers'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function FamilyProvidersPage() {
  return (
    <div>
      <section className="p-5">
        <p className="text-lg">
          Pay your existing provider or add a new one. If you use a licensed
          childcare center or home, search for them below. If a friend, family
          member or neighbor cares for your child, invite them to be in the
          pilot. (They will need to apply and be approved to receive funding).
        </p>
      </section>
      <div className="flex flex-col lg:flex-row">
        <section className="p-5 flex-1">
          <Header>YOUR PROVIDERS</Header>
          <ProviderList />
        </section>
        <section className="p-5 flex-1">
          <Header>ADD A PROVIDER</Header>
          <WhiteCard>
            <div className="flex gap-5 items-center justify-center flex-col">
              <strong className="text-xl text-center">
                Search for existing childcare centers or licensed home-based
                providers.
              </strong>
              <Button
                disabled
              >
                {/* <Link to="/family">Search</Link> */}
                Search (Coming Soon)
              </Button>   
              <Separator />
              <strong className="text-xl text-center">
                Invite your Family, Friend, or Neighbor Caregiver
              </strong>
              <Button
                disabled
              >
                {/* <Link to="/family">Search</Link> */}
                Invite (Coming Soon)
              </Button>
            </div>
          </WhiteCard>
        </section>
      </div>
    </div>
  )
}
