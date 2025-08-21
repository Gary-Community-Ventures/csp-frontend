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
  onChange: (value: number | null) => void
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

  const [value, setValue] = useState<number | null>(null)

  const id = `attendance-${attendanceId}`

  useEffect(() => {
    onChange(value)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="py-2">
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <div className="max-w-[15rem]">
          <Input
            id={id}
            type="number"
            placeholder={text(t.inputPlaceholder)}
            value={value === null ? '' : String(value)}
            onChange={(event) => {
              const rawValue = event.target.value
              if (rawValue === '') {
                setValue(null)
                return
              }

              const value = Number(rawValue)

              if (!Number.isNaN(value) && schema.safeParse(value).success) {
                setValue(value)
              }
            }}
          />
          <FormErrorMessage
            error={value === null && submitted ? text(t.required) : undefined}
          />
        </div>
      </div>
    </div>
  )
}
