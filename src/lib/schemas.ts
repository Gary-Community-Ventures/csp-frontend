import { useLanguageContext } from '@/translations/wrapper'
import { useEffect, useState } from 'react'
import { z } from 'zod'

type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${ObjectPaths<T[K]>}`
        : `${K}`
    }[keyof T & string]
  : never

export function useValidateForm<T extends z.ZodType<any, any, any>>(
  schema: T,
  data: unknown
) {
  const { lang } = useLanguageContext()
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    if (!showErrors) {
      return
    }

    const result = schema.safeParse(data)

    if (result.success) {
      setErrors([])
      return
    }

    setErrors(result.error.issues)
  }, [data, lang])

  const submit = (
    onSuccess: (data: z.infer<T>) => void,
    onError?: () => void
  ) => {
    setShowErrors(true)

    const result = schema.safeParse(data)

    if (result.success) {
      return onSuccess(result.data)
    } else {
      onError?.()
    }

    setErrors(result.error.issues)
  }

  const getError = (path: ObjectPaths<z.infer<T>>) => {
    if (!showErrors) {
      return undefined
    }

    return errors.find((err) => err.path.join('.') === path)?.message
  }

  return { getError, submit }
}

export const allocatedCareDaySchema = z.object({
  date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  type: z.enum(['Full Day', 'Half Day']),
  provider_google_sheets_id: z.number(),
  id: z.number(),
  care_month_allocation_id: z.number(),
  amount_cents: z.number(),
  day_count: z.number(),
  payment_distribution_requested: z.boolean(),
  last_submitted_at: z.string().datetime().nullable().default(null),
  deleted_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  locked_date: z.string().datetime(),
  is_locked: z.boolean(),
  is_deleted: z.boolean(),
  needs_resubmission: z.boolean(),
  delete_not_submitted: z.boolean(),
  is_new: z.boolean(),
  status: z.string(),
})

export const monthAllocationSchema = z.object({
  id: z.number(),
  date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  allocation_cents: z.number(),
  google_sheets_child_id: z.number(),
  used_days: z.number(),
  used_cents: z.number(),
  remaining_cents: z.number(),
  over_allocation: z.boolean(),
  locked_until_date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  care_days: z.array(allocatedCareDaySchema),
})

export const childBaseSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
})

export const childCreateSchema = childBaseSchema.extend({
  family_id: z.number(),
})

export const childSchema = childBaseSchema.extend({
  id: z.number(),
  family_id: z.number(),
  created_at: z.string().datetime().nullable().default(null),
  updated_at: z.string().datetime().nullable().default(null),
})

export const paymentRequestSchema = z.object({
  id: z.number(),
  care_day_ids: z.array(z.number()),
  care_days_count: z.number(),
  amount: z.string(),
  provider_google_sheets_id: z.number(),
  child_google_sheets_id: z.number(),
  email_sent_successfully: z.boolean(),
  processed: z.boolean(),
  processed_date: z.string().nullable(),
})

export const paymentRateSchema = z.object({
  id: z.number(),
  google_sheets_provider_id: z.number(),
  google_sheets_child_id: z.number(),
  half_day_rate_cents: z.number(),
  full_day_rate_cents: z.number(),
})
