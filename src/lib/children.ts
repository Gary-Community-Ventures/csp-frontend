import type { Child } from 'src/routes/family/wrapper'

export const findProviderById = (children: Child[], childId: string | null) => {
  if (childId === null) {
    return undefined
  }
  return children.find((c) => c.id === childId)
}
