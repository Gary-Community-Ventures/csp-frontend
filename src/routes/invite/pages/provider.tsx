import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-react'
import { translations } from '@/translations/text'
import type { RouterContext } from '@/routes/router'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
  headersWithAuthOptional,
} from '@/lib/api/client'
import { providerRoute } from '../routes'
import { Link, useMatch, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ExternalLink } from '@/components/external-link'
import { useMemo, useState } from 'react'
import { CLERK_PROVIDER_TYPE } from '@/lib/constants'

let a = 1
a = '1'
console.error(a)

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
      headers: await headersWithAuthOptional(context),
      signal: abortController.signal,
    }
  )

  handleStatusCodes(context, res)

  const rawJson = (await res.json()) as ApiResponse

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

function useFormUrl() {
  const { inviteId } = providerRoute.useParams()

  const formUrl = new URL(BASE_APPLY_FORM_URL)
  formUrl.searchParams.append('link_id', inviteId)

  return formUrl.href
}

export function ProviderInvitePage() {
  const t = translations.invite.provider
  const { invite } = providerRoute.useLoaderData()
  const clerk = useClerk()
  const { child, family, accepted } = invite
  const familyName = family.firstName + ' ' + family.lastName
  const childName = child.firstName + ' ' + child.lastName

  const formUrl = useFormUrl()

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
                <ExternalLink href={formUrl}>
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
  const { user, isLoaded, isSignedIn } = useUser()
  const formUrl = useFormUrl()

  const isProvider = useMemo(() => {
    if (!isLoaded || !isSignedIn) {
      return false
    }

    const types = user.publicMetadata.types as string[]

    return types.includes(CLERK_PROVIDER_TYPE)
  }, [user, isLoaded, isSignedIn])

  const { alreadyCaringFor, atMaxChildCount } = invite

  if (!isProvider) {
    return (
      <>
        <p className="text-xl text-center">
          <Text text={t.notProvider} />
        </p>
        <Button asChild>
          <ExternalLink href={formUrl}>
            <Text text={t.dontHaveAccountButton} />
          </ExternalLink>
        </Button>
      </>
    )
  }

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
