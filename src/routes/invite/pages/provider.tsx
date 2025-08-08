import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
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
import { useState } from 'react'

type ApiResponse = {
  child: {
    id: string
    first_name: string
    last_name: string
  }
  family: {
    id: string
    first_name: string
    last_name: string
  }
  accepted: boolean
  already_caring_for: boolean
  at_max_child_count: boolean
}

type Invite = {
  child: {
    id: string
    firstName: string
    lastName: string
  }
  family: {
    id: string
    firstName: string
    lastName: string
  }
  accepted: boolean
  alreadyCaringFor: boolean
  atMaxChildCount: boolean
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
      child: {
        id: 0,
        firstName: '{first_name}',
        lastName: '{last_name}',
      },
      family: {
        id: 0,
        firstName: '{first_name}',
        lastName: '{last_name}',
      },
      accepted: false,
      alreadyCaringFor: false,
      atMaxChildCount: true,
    }
  }
  return {
    invite: {
      child: {
        id: rawJson.child.id,
        firstName: rawJson.child.first_name,
        lastName: rawJson.child.last_name,
      },
      family: {
        id: rawJson.family.id,
        firstName: rawJson.family.first_name,
        lastName: rawJson.family.last_name,
      },
      accepted: rawJson.accepted,
      alreadyCaringFor: rawJson.already_caring_for,
      atMaxChildCount: rawJson.at_max_child_count,

    } satisfies Invite,
  }
}

const BASE_APPLY_FORM_URL = 'https://form.jotform.com/252056647581159'

export function ProviderInvitePage() {
  const t = translations.invite.provider
  const { inviteId } = providerRoute.useParams()
  const { invite } = providerRoute.useLoaderData()
  const clerk = useClerk()
  const { child, family, accepted } = invite
  const familyName = family.firstName + ' ' + family.lastName
  const childName = child.firstName + ' ' + child.lastName

  const formUrl = new URL(BASE_APPLY_FORM_URL)
  formUrl.searchParams.append('link_id', inviteId)

  return (
    <WhiteCard className="container m-auto mt-10">
      <Header Tag="h1" className="text-center text-xl">
        {familyName}
        <Text text={t.header} />
        {childName}
      </Header>
      <section className="flex flex-col gap-6 items-center">
        {accepted ? (
          <>
            <p>
              <Text text={t.accepted} />
            </p>
            <Button asChild>
              <Link to="/provider/home">
                <Text text={t.toHome} />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <SignedOut>
              <p>
                <Text text={t.dontHaveAccount} />
              </p>
              <Button asChild>
                <ExternalLink href={formUrl.href}>
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
              <SignedInOptions />
            </SignedIn>
          </>
        )}
      </section>
    </WhiteCard>
  )
}

function SignedInOptions() {
  const t = translations.invite.provider
  const { inviteId } = providerRoute.useParams()
  const { invite } = providerRoute.useLoaderData()
  const { context } = useMatch({ from: '__root__' })
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { alreadyCaringFor, atMaxChildCount } = invite

  if (alreadyCaringFor) {
    return (
      <>
        <p>
          <Text text={t.alreadyCaringFor} />
        </p>
        <Button asChild>
          <Link to="/provider/home">
            <Text text={t.toHome} />
          </Link>
        </Button>
      </>
    )
  }

  if (atMaxChildCount) {
    return (
      <>
        <p>
          <Text text={t.atMaxChildCount} />
        </p>
        <Button asChild>
          <Link to="/provider/home">
            <Text text={t.toHome} />
          </Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <p>
        <Text text={t.alreadySignedIn} />
      </p>
      <Button
        onClick={() => {
          setSubmitting(true)
          acceptInvite(inviteId, context)
            .then(() => {
              navigate({ to: '/provider/home' })
              toast('success')
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
        disabled={submitting}
      >
        <Text text={t.alreadySignedInButton} />
      </Button>
    </>
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
