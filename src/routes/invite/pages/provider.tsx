import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { translations } from '@/translations/text'

export function ProviderInvitePage() {
  const t = translations.invite.provider
  const children = [
    {
      id: 1,
      firstName: 'Tom',
      lastName: 'Brady',
    },
    {
      id: 2,
      firstName: 'Rob',
      lastName: 'Gronkowski',
    },
    {
      id: 3,
      firstName: 'Julian',
      lastName: 'Edelman',
    },
  ]
  const familyName = 'Bill Belicheck'

  return (
    <WhiteCard className="container m-auto mt-10">
      <section className="flex flex-col gap-6 pb-10 items-center">
        <Header Tag="h1" className="text-center text-xl">
          {familyName}
          <Text text={t.header} />
        </Header>
        <ul>
          {children.map((child) => (
            <li key={child.id}>
              {child.firstName} {child.lastName}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-6 items-center">
        <Header className="text-xl">
          <Text text={t.addFamilyHeader} />
        </Header>
        <SignedOut>
          <p>
            <Text text={t.dontHaveAccount} />
          </p>
          <Button>
            <Text text={t.dontHaveAccountButton} />
          </Button>
          <Separator />
          <p>
            <Text text={t.signIn} />
          </p>
          <Button>
            <Text text={t.signInButton} />
          </Button>
        </SignedOut>
        <SignedIn>
          <Button>
            <Text text={t.alreadySignedInButton} />
          </Button>
        </SignedIn>
      </section>
    </WhiteCard>
  )
}
