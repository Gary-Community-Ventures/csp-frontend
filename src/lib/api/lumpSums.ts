import type { RouterContext } from '@/routes/router'
import {
  allocatedLumpSumResponseSchema,
  createLumpSumRequestSchema,
} from '../schemas'
import { z } from 'zod'
import { backendUrl, handleStatusCodes, headersWithAuth } from './client'

export type CreateLumpSumRequest = z.infer<typeof createLumpSumRequestSchema>
export type AllocatedLumpSumResponse = z.infer<
  typeof allocatedLumpSumResponseSchema
>

export async function createLumpSum(
  context: RouterContext,
  data: CreateLumpSumRequest
): Promise<AllocatedLumpSumResponse> {
  const url = backendUrl('/lump-sums')
  const res = await fetch(url, {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify(data),
  })

  handleStatusCodes(context, res)
  const responseData = await res.json()
  try {
    const parsedData = allocatedLumpSumResponseSchema.parse(responseData)
    return parsedData
  } catch (error: any) {
    if (
      responseData &&
      responseData.error ===
        'Adding this lump sum would exceed monthly allocation'
    ) {
      throw new Error('MONTHLY_ALLOCATION_EXCEEDED')
    }
    console.error('Zod parsing error for AllocatedLumpSumResponse:', error)
    throw error
  }
}
