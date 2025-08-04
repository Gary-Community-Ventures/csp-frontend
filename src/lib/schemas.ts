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

export const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  hours: z.number().min(1, 'Hours must be greater than 0'),
  providerId: z
    .number()
    .refine((val) => val !== 0, { message: 'Provider is required' }),
})

