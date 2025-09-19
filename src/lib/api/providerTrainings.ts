import type { RouterContext } from '@/routes/router'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'
import type { z } from 'zod'
import type {
  ProviderTrainingUpdateRequestSchema,
  ProviderTrainingResponseSchema,
} from '../schemas'

export async function getProviderTrainings(
  context: RouterContext
): Promise<z.infer<typeof ProviderTrainingResponseSchema>> {
  const response = await fetch(backendUrl('/provider/trainings'), {
    method: 'GET',
    headers: await headersWithAuth(context),
  })

  handleStatusCodes(context, response)

  if (!response.ok) {
    throw new Error(`Failed to fetch provider trainings: ${response.status}`)
  }

  return response.json()
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
