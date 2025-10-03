import { useEffect, useState } from 'react'
import { FormErrorMessage } from './form-error'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import z from 'zod'

type AttendanceInputProps = {
  label: string
  attendanceId: string
  submitted: boolean
  onChange: (fullDays: number | null, halfDays: number | null) => void
}

export function AttendanceInput({
  label,
  attendanceId,
  submitted,
  onChange,
}: AttendanceInputProps) {
  const t = translations.general.attendanceInput
  const text = useText()

  const schema = z.number().nonnegative().int()

  const [fullDays, setFullDays] = useState<number | null>(null)
  const [halfDays, setHalfDays] = useState<number | null>(null)

  const id = `attendance-${attendanceId}`

  useEffect(() => {
    onChange(fullDays, halfDays)
  }, [fullDays, halfDays]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="py-2">
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex gap-2">
          <div className="max-w-[15rem]">
            <Input
              id={id}
              type="number"
              placeholder={text(t.fullDayInputPlaceholder)}
              value={fullDays === null ? '' : String(fullDays)}
              onChange={(event) => {
                const rawValue = event.target.value
                if (rawValue === '') {
                  setFullDays(null)
                  return
                }

                const value = Number(rawValue)

                if (!Number.isNaN(value) && schema.safeParse(value).success) {
                  setFullDays(value)
                }
              }}
            />
            <FormErrorMessage
              error={
                fullDays === null && submitted ? text(t.required) : undefined
              }
            />
          </div>
          <div className="max-w-[15rem]">
            <Input
              id={id}
              type="number"
              placeholder={text(t.halfDayInputPlaceholder)}
              value={fullDays === null ? '' : String(halfDays)}
              onChange={(event) => {
                const rawValue = event.target.value
                if (rawValue === '') {
                  setHalfDays(null)
                  return
                }

                const value = Number(rawValue)

                if (!Number.isNaN(value) && schema.safeParse(value).success) {
                  setHalfDays(value)
                }
              }}
            />
            <FormErrorMessage
              error={
                halfDays === null && submitted ? text(t.required) : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
