import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import type { RouterContext } from '@/routes/router'
import { findProviderRoute } from '../routes'
import { CardList } from '@/components/card-list'
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type PropsWithChildren,
} from 'react'
import { Header } from '@/components/header'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOnVisible } from '@/lib/on-visible'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useFamilyContext } from '../wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMatch, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'
import { useValidateForm, useZodSchema } from '@/lib/schemas'
import { FormErrorMessage } from '@/components/form-error'

type ApiResponse = {
  providers: {
    license_number: string
    name: string
    address: {
      street_address: string
      city: string
      state: string
      zip: string
      county: string
    }
    rating: string
  }[]
}

type Provider = {
  licenseNumber: string
  name: string
  address: {
    streetAddress: string
    city: string
    state: string
    zip: string
    county: string
  }
  rating: string
}

export async function loadProviders({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/family/licensed-providers'), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = (await res.json()) as ApiResponse

  return {
    providers: rawJson.providers.map((p): Provider => {
      return {
        licenseNumber: p.license_number,
        name: p.name,
        address: {
          streetAddress: p.address.street_address,
          city: p.address.city,
          state: p.address.state,
          zip: p.address.zip,
          county: p.address.county,
        },
        rating: p.rating,
      }
    }),
  }
}

const DEFAULT_RENDERED_PROVIDER_COUNT = 50

export default function FindProviderPage() {
  const t = translations.family.findProviderPage
  const text = useText()
  const { providers } = findProviderRoute.useLoaderData()
  const [search, setSearch] = useState('')
  const [filteredProviders, setMappedProviders] = useState<Provider[]>([])
  const [renderedProviderCount, setRenderedProviderCount] = useState(
    DEFAULT_RENDERED_PROVIDER_COUNT
  )

  const loadMore = useCallback(() => {
    setRenderedProviderCount((c) => c + DEFAULT_RENDERED_PROVIDER_COUNT)
  }, [])

  const onVisibleRef = useOnVisible(loadMore)

  useEffect(() => {
    const filteredProviders = providers.filter((provider) => {
      if (search === '') {
        return true
      }

      // check if every word is in the provider name
      return search
        .toLowerCase()
        .split(' ')
        .every((word) => {
          return provider.name.toLowerCase().includes(word)
        })
    })

    const sortedProviders = filteredProviders.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    })

    setMappedProviders(sortedProviders)
    setRenderedProviderCount(DEFAULT_RENDERED_PROVIDER_COUNT)
  }, [providers, search])

  return (
    <div className="p-5">
      <Header Tag="h1">
        <Text text={t.header} />
      </Header>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5"
        placeholder={text(t.searchPlaceholder)}
      />
      <CardList
        items={filteredProviders
          .slice(0, renderedProviderCount)
          .map((provider) => {
            return (
              <div className="flex justify-between">
                <div>
                  <strong className="text-lg">{provider.name}</strong>
                  <div className="text-muted-foreground text-sm">
                    {provider.address.streetAddress !== 'NA'
                      ? `${provider.address.streetAddress}, `
                      : ''}
                    {provider.address.city}, {provider.address.state}{' '}
                    {provider.address.zip}
                  </div>
                </div>
                <AddProviderForm provider={provider}>
                  <Button>
                    <Text text={t.inviteButton} />
                  </Button>
                </AddProviderForm>
              </div>
            )
          })}
      />
      {renderedProviderCount < filteredProviders.length && (
        <Button className="mt-5 mx-auto" onClick={loadMore} ref={onVisibleRef}>
          <Text text={t.loadMoreButton} />
        </Button>
      )}
    </div>
  )
}

type AddProviderFormProps = PropsWithChildren<{ provider: Provider }>
function AddProviderForm({ children, provider }: AddProviderFormProps) {
  const t = translations.family.findProviderPage.addProviderForm
  const text = useText()
  const navigate = useNavigate()
  const { context } = useMatch({ from: '__root__' })
  const { children: allChildren, selectedChildInfo } = useFamilyContext()
  const [formData, setFormData] = useState<{
    children: string[]
  }>({ children: [selectedChildInfo.id] })
  const schema = useZodSchema(
    z.object({
      children: z
        .array(z.string())
        .min(1, { message: text(t.noChildrenSelectedError) }),
    })
  )
  const [submitting, setSubmitting] = useState(false)

  const { getError, submit } = useValidateForm(schema, formData)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    submit(
      () => {
        submitProviders(provider, formData.children, context)
          .then(() => {
            toast(text(t.successMessage) + provider.name)
            navigate({ to: '/family/$childId/providers' })
          })
          .finally(() => {
            setSubmitting(false)
          })
      },
      // if validation fails
      () => {
        setSubmitting(false)
      }
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <form id="select-provider-form" onSubmit={handleSubmit}>
          <SheetHeader className="pt-7">
            <SheetTitle>
              <Header Tag="strong">
                <Text text={t.header} />
                {provider.name}
              </Header>
            </SheetTitle>
            <SheetDescription className="sr-only">
              <Text text={t.header} />
            </SheetDescription>
          </SheetHeader>
          {allChildren.map((child) => {
            const id = `select-provider-selected-child-${child.id}`
            return (
              <div key={child.id} className="px-4 flex gap-3">
                <Checkbox
                  id={id}
                  className="my-3"
                  checked={formData.children.includes(child.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((c) => {
                        return { ...c, children: [...c.children, child.id] }
                      })
                    } else {
                      setFormData((c) => {
                        return {
                          ...c,
                          children: c.children.filter(
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
          <FormErrorMessage error={getError('children')} className="px-4" />
        </form>
        <SheetFooter>
          <Button
            type="submit"
            form="select-provider-form"
            loading={submitting}
          >
            <Text text={t.submitButton} />
          </Button>
          <SheetClose asChild>
            <Button variant="outline">
              <Text text={t.closeButton} />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

async function submitProviders(
  provider: Provider,
  childIds: string[],
  context: RouterContext
) {
  const res = await fetch(backendUrl('/family/licensed-providers'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      license_number: provider.licenseNumber,
      child_ids: childIds,
    }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to invite provider: ${res.statusText}`)
  }

  return res.json()
}
