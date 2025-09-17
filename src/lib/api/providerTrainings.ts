import type { RouterContext } from '@/routes/router'
import { backendUrl, headersWithAuth } from './client'
import type { z } from 'zod'
import type { ProviderTrainingUpdateRequestSchema } from '../schemas'

export async function getProviderTrainings(context: RouterContext) {
  const res = await fetch(backendUrl('/provider/trainings'), {
    headers: await headersWithAuth(context),
  })
  return res
}

export async function updateProviderTrainings(
  context: RouterContext,
  data: z.infer<typeof ProviderTrainingUpdateRequestSchema>
) {
  const res = await fetch(backendUrl('/provider/trainings'), {
    method: 'PATCH',
    headers: await headersWithAuth(context),
    body: JSON.stringify(data),
  })
  return res
}
