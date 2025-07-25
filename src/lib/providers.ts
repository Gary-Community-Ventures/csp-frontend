import type { Provider } from 'src/routes/family/wrapper'

export const findProviderById = (
  providers: Provider[],
  providerId: number | null
) => {
  if (providerId === null) {
    return undefined
  }
  return providers.find((p) => p.id === providerId)
}
