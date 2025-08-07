import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WhiteCard } from '@/components/white-card'
import { Text, useText } from '@/translations/wrapper'
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react'
import { translations } from '@/translations/text'
import type { RouterContext } from '@/routes/router'
import {
  backendUrl,
  DEFAULT_HEADERS,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import { providerRoute } from '../routes'
import { Link, useMatch, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ExternalLink } from '@/components/external-link'

type ApiResponse = {
  children: {
    id: number
    first_name: string
    last_name: string
  }[]
  family: {
    id: number
    first_name: string
    last_name: string
  }
  accepted: boolean
}

type Invite = {
  children: {
    id: number
    firstName: string
    lastName: string
  }[]
  family: {
    id: number
    firstName: string
    lastName: string
  }
  accepted: boolean
}

export async function loadProviderInvite({
  context,
  abortController,
  params,
}: {
  context: RouterContext
  abortController: AbortController
  params: { inviteId: string }
}) {
  const res = await fetch(
    backendUrl(`/family/provider-invite/${params.inviteId}`),
    {
      headers: DEFAULT_HEADERS,
      signal: abortController.signal,
    }
  )

  handleStatusCodes(context, res)

  const rawJson = (await res.json()) as ApiResponse

  return {
    invite: {
      children: rawJson.children.map((child) => ({
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
      })),
      family: {
        id: rawJson.family.id,
        firstName: rawJson.family.first_name,
        lastName: rawJson.family.last_name,
      },
      accepted: rawJson.accepted,
    } satisfies Invite,
  }
}

export function ProviderInvitePage() {
  const t = translations.invite.provider
  const text = useText()
  const { inviteId } = providerRoute.useParams()
  const { context } = useMatch({ from: '__root__' })
  const { invite } = providerRoute.useLoaderData()
  const clerk = useClerk()
  const navigate = useNavigate()
  const { children, family, accepted } = invite
  const familyName = family.firstName + ' ' + family.lastName

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
        {accepted ? (
          <>
            <Header className="text-xl">
              <Text text={t.accepted} />
            </Header>
            <Button asChild>
              <Link to="/provider/home">
                <Text text={t.toHome} />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Header className="text-xl">
              <Text text={t.addFamilyHeader} />
            </Header>
            <SignedOut>
              <p>
                <Text text={t.dontHaveAccount} />
              </p>
              <Button asChild>
                <ExternalLink href="https://form.jotform.com/252056647581159">
                  <Text text={t.dontHaveAccountButton} />
                </ExternalLink>
              </Button>
              <Separator />
              <p>
                <Text text={t.signIn} />
              </p>
              <Button onClick={() => clerk.redirectToSignIn()}>
                <Text text={t.signInButton} />
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                onClick={() =>
                  acceptInvite(inviteId, context).then(() => {
                    navigate({ to: '/provider/home' })
                    toast(text(t.successMessage))
                  })
                }
              >
                <Text text={t.alreadySignedInButton} />
              </Button>
            </SignedIn>
          </>
        )}
      </section>
    </WhiteCard>
  )
}

async function acceptInvite(inviteId: string, context: RouterContext) {
  const res = await fetch(
    backendUrl(`/family/provider-invite/${inviteId}/accept`),
    {
      method: 'POST',
      headers: await headersWithAuth(context),
    }
  )

  handleStatusCodes(context, res)

  return res.json()
}
