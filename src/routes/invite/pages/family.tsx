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
  handleStatusCodes,
  headersWithAuth,
  headersWithAuthOptional,
} from '@/lib/api/client'
import { familyRoute } from '../routes'
import { Link, useMatch, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ExternalLink } from '@/components/external-link'
import z from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useValidateForm } from '@/lib/schemas'
import { Label } from '@/components/ui/label'
import { FormErrorMessage } from '@/components/form-error'

type ApiResponse = {
  provider: {
    id: string
    first_name: string
    last_name: string
  }
  children:
    | {
        id: string
        first_name: string
        last_name: string
      }[]
    | null
  accepted: boolean
  is_already_provider: boolean
  remaining_slots: number
}

type Child = {
  id: string
  firstName: string
  lastName: string
}

type Invite = {
  provider: {
    id: string
    firstName: string
    lastName: string
  }
  children: Child[] | null
  accepted: boolean
  isAlreadyProvider: boolean
  remainingSlots: number
}

export async function loadFamilyInvite({
  context,
  abortController,
  params,
}: {
  context: RouterContext
  abortController: AbortController
  params: { inviteId: string }
}) {
  const res = await fetch(
    backendUrl(`/provider/family-invite/${params.inviteId}`),
    {
      headers: await headersWithAuthOptional(context),
      signal: abortController.signal,
    }
  )

  handleStatusCodes(context, res)

  const rawJson = (await res.json()) as ApiResponse

  let children = null
  if (rawJson.children !== null) {
    children = rawJson.children.map((child) => ({
      id: child.id,
      firstName: child.first_name,
      lastName: child.last_name,
    }))
  }

  return {
    invite: {
      provider: {
        id: rawJson.provider.id,
        firstName: rawJson.provider.first_name,
        lastName: rawJson.provider.last_name,
      },
      children: children,
      accepted: rawJson.accepted,
      isAlreadyProvider: rawJson.is_already_provider,
      remainingSlots: rawJson.remaining_slots,
    } satisfies Invite,
  }
}

const BASE_APPLY_FORM_URL = 'https://form.jotform.com/252036367719058'

export function FamilyInvitePage() {
  const t = translations.invite.family
  const clerk = useClerk()
  const { invite } = familyRoute.useLoaderData()
  const { inviteId } = familyRoute.useParams()

  const formUrl = new URL(BASE_APPLY_FORM_URL)
  formUrl.searchParams.append('link_id', inviteId)

  const providerName =
    invite.provider.firstName + ' ' + invite.provider.lastName
  const accepted = invite.accepted
  const children = invite.children
  const remainingSlots = invite.remainingSlots
  const isAlreadyProvider = invite.isAlreadyProvider

  return (
    <WhiteCard className="container m-auto mt-10">
      <section className="flex flex-col gap-6 items-center">
        <Header Tag="h1" className="text-center text-xl">
          {providerName}
          <Text text={t.header} />
        </Header>
      </section>
      <section className="flex flex-col gap-6 items-center">
        {accepted ? (
          <>
            <p>
              <Text text={t.alreadyAccepted.part1} />
              {providerName}
              <Text text={t.alreadyAccepted.part2} />
            </p>
            <Button asChild>
              <Link to="/provider/home">
                <Text text={t.toHome} />
              </Link>
            </Button>
          </>
        ) : remainingSlots > 0 ? (
          <>
            <SignedOut>
              <p>
                <Text text={t.joinNow} />
              </p>
              <Button asChild>
                <ExternalLink href={formUrl.href}>
                  <Text text={t.applyButton} />
                </ExternalLink>
              </Button>
              <Separator />
              <p>
                <Text text={t.alreadyHaveAccount} />
              </p>
              <Button onClick={() => clerk.redirectToSignIn()}>
                <Text text={t.signInButton} />
              </Button>
            </SignedOut>
            <SignedIn>
              {children !== null &&
              (children.length > 0 || isAlreadyProvider) ? (
                <AcceptForm
                  familyChildren={children}
                  providerName={providerName}
                  remainingSlots={remainingSlots}
                  isAlreadyProvider={isAlreadyProvider}
                />
              ) : (
                <>
                  <p>
                    <Text text={t.noChildren} />
                  </p>
                  <Button asChild>
                    <ExternalLink href={formUrl.href}>
                      <Text text={t.applyButton} />
                    </ExternalLink>
                  </Button>
                </>
              )}
            </SignedIn>
          </>
        ) : (
          <>
            <p>
              <Text text={t.noSlotsRemaining} />
            </p>
            <SignedIn>
              <Button asChild>
                <Link to="/provider/home">
                  <Text text={t.toHome} />
                </Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <Button onClick={() => clerk.redirectToSignIn()}>
                <Text text={t.signInButton} />
              </Button>
            </SignedOut>
          </>
        )}
      </section>
    </WhiteCard>
  )
}

type AcceptFormProps = {
  familyChildren: Child[]
  providerName: string
  remainingSlots: number
  isAlreadyProvider: boolean
}

function AcceptForm({
  familyChildren,
  providerName,
  remainingSlots,
  isAlreadyProvider,
}: AcceptFormProps) {
  const t = translations.invite.family
  const text = useText()
  const { inviteId } = familyRoute.useParams()
  const { context } = useMatch({ from: '__root__' })
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const schema = z.object({
    children: z
      .array(z.string())
      .min(1, { message: text(t.selectChildrenError) })
      .max(remainingSlots, {
        message: `${text(t.maxSlotsReached.part1)}${remainingSlots}${text(t.maxSlotsReached.part2)}`,
      }),
  })
  const [formData, setFormData] = useState<z.infer<typeof schema>>({
    children: [],
  })

  const { getError, submit } = useValidateForm(schema, formData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)

    submit(
      (data) => {
        acceptInvite(inviteId, data.children, context)
          .then(() => {
            navigate({ to: '/provider/home' })
            toast('success')
          })
          .finally(() => {
            setSubmitting(false)
          })
      },
      () => {
        setSubmitting(false)
      }
    )
  }

  if (familyChildren.length === 0 && isAlreadyProvider) {
    return (
      <>
        <p>
          <Text text={t.alreadyAccepted.part1} />
          {providerName}
          <Text text={t.alreadyAccepted.part2} />
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
    <form onSubmit={handleSubmit}>
      <p className="pb-5">
        <Text text={t.selectChildren.part1} />
        {providerName}
        <Text text={t.selectChildren.part2} />
      </p>
      {familyChildren.map((child) => {
        const id = `accept-invite-selected-child-${child.id}`

        return (
          <div key={child.id} className="flex gap-3">
            <Checkbox
              id={id}
              className="my-3"
              checked={formData.children.includes(child.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      children: [...prev.children, child.id],
                    }
                  })
                } else {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      children: prev.children.filter(
                        (childId) => childId !== child.id
                      ),
                    }
                  })
                }
              }}
            />
            <Label htmlFor={id} className="flex grow py-3">
              {child.firstName} {child.lastName}
            </Label>
          </div>
        )
      })}
      <FormErrorMessage error={getError('children')} />
      <div className="flex justify-center">
        <Button type="submit" disabled={submitting} className="mt-5">
          <Text text={t.acceptButton} />
        </Button>
      </div>
    </form>
  )
}

async function acceptInvite(
  inviteId: string,
  childIds: string[],
  context: RouterContext
) {
  const res = await fetch(
    backendUrl(`/provider/family-invite/${inviteId}/accept`),
    {
      method: 'POST',
      headers: await headersWithAuth(context),
      body: JSON.stringify({
        child_ids: childIds,
      }),
    }
  )

  handleStatusCodes(context, res)

  return res.json()
}
