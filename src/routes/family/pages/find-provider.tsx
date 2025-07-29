import { backendUrl, handleStatusCodes, headersWithAuth } from '@/lib/requests'
import type { RouterContext } from '@/routes/router'
import { findProviderRoute } from '../routes'
import { CardList } from '@/components/card-list'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Header } from '@/components/header'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOnVisible } from '@/lib/on-visible'

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
  params: { childId?: number }
}) {
  const res = await fetch(backendUrl('/family/providers-list'), {
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
          .filter((_, i) => i < renderedProviderCount)
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
                <Button>
                  <Text text={t.inviteButton} />
                </Button>
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
