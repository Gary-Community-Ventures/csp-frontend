import { Header } from '@/components/header'
import { CaregiversList } from '../components/caregivers'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'

export function FamilyProvidersPage() {
  return (
    <div>
      <section className="p-5">
        <p className="text-lg">
          Take out whatever help text bubble copy we're putting on mobile and
          just put it here. Explain child care center/FFNS
        </p>
      </section>
      <div className="flex flex-col lg:flex-row">
        <section className="p-5 flex-1">
          <Header>YOUR PROVIDERS</Header>
          <CaregiversList />
        </section>
        <section className="p-5 flex-1">
          <Header>ADD A CAREGIVER</Header>
          <WhiteCard>
            <div className="flex gap-5 items-center justify-center flex-col">
              <strong className="text-xl text-center">
                Search for existing childcare centers or licensed home-based
                providers.
              </strong>
              <Button asChild>
                {/* TODO: Add a link to the search page */}
                <Link to="/family">Search</Link>
              </Button>
              <Separator />
              <strong className="text-xl text-center">
                Invite your Family, Friend, or Neighbor Care Giver
              </strong>
              <Button asChild>
                {/* TODO: Add a link to the invite page */}
                <Link to="/family">Invite</Link>
              </Button>
            </div>
          </WhiteCard>
        </section>
      </div>
    </div>
  )
}
