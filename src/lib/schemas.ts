import { useLanguageContext } from '@/translations/wrapper'
import { useEffect, useMemo, useState, type DependencyList } from 'react'
import { z } from 'zod'

type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${ObjectPaths<T[K]>}`
        : `${K}`
    }[keyof T & string]
  : never

export function useValidateForm<T extends z.ZodSchema<any, any, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
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
  }, [data, lang, showErrors, schema])

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

export function useZodSchema<T>(
  schema: z.ZodType<T>,
  otherDeps?: DependencyList
) {
  const { lang } = useLanguageContext()

  return useMemo(() => schema, [lang, ...(otherDeps ?? [])]) // eslint-disable-line react-hooks/exhaustive-deps
}

export const allocatedCareDaySchema = z.object({
  date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  type: z.enum(['Full Day', 'Half Day']),
  provider_google_sheets_id: z.string(),
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
  google_sheets_child_id: z.string(),
  remaining_unselected_cents: z.number(),
  remaining_unpaid_cents: z.number(),
  locked_until_date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  locked_past_date: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date format' }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  care_days: z.array(allocatedCareDaySchema),
})

export const paymentRequestSchema = z.object({
  id: z.number(),
  care_day_ids: z.array(z.number()),
  care_days_count: z.number(),
  amount: z.string(),
  provider_google_sheets_id: z.string(),
  child_google_sheets_id: z.string(),
  email_sent_successfully: z.boolean(),
  processed: z.boolean(),
  processed_date: z.string().nullable(),
})

export const paymentRateSchema = z.object({
  id: z.number(),
  google_sheets_provider_id: z.string(),
  google_sheets_child_id: z.string(),
  half_day_rate_cents: z.number(),
  full_day_rate_cents: z.number(),
})

export const allocatedLumpSumResponseSchema = z.object({
  id: z.number(),
  care_month_allocation_id: z.number(),
  provider_google_sheets_id: z.string(),
  amount_cents: z.number(),
  hours: z.number().nullable().default(null),
})

export const createLumpSumRequestSchema = z.object({
  allocation_id: z.number(),
  provider_id: z.string(),
  amount_cents: z.number(),
  hours: z.number().min(0),
})
