import { Header } from '@/components/header'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Fragment, useCallback, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import type { RouterContext } from '@/routes/router'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'

import { Link, useMatch, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { dateInRange, useFormatDate, weekRange } from '@/lib/dates'
import { attendanceRoute } from '../routes'
import { AttendanceInput } from '@/components/attendance-input'

type ApiResponse = {
  attendance: {
    id: string
    date: string
    child_id: string
  }[]
  children: {
    id: string
    first_name: string
    last_name: string
  }[]
}

type Child = {
  id: string
  firstName: string
  lastName: string
}

type Attendance = {
  id: string
  child: Child
}[]

type Week = {
  range: [Date, Date]
  attendance: Attendance
}

export async function loadAttendance({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/provider/attendance'), {
    headers: await headersWithAuth(context),
    signal: abortController.signal,
  })

  handleStatusCodes(context, res)

  const rawJson = (await res.json()) as ApiResponse

  const data: Week[] = []

  for (const att_data of rawJson.attendance) {
    const date = new Date(att_data.date)
    let week = data.find((w) => dateInRange(date, w.range))

    if (week === undefined) {
      week = {
        range: weekRange(date),
        attendance: [],
      }
      data.push(week)
    }

    const child = rawJson.children.find((c) => c.id === att_data.child_id)

    if (child === undefined) {
      throw new Error(
        `Failed to load attendance: child not found with id ${att_data.child_id}`
      )
    }

    week.attendance.push({
      id: att_data.id,
      child: {
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
      },
    })
  }

  data.sort((a, b) => a.range[0].getTime() - b.range[0].getTime())

  return {
    weeks: data,
  }
}

function attendanceIsValid(attendance: {
  [key: string]: number | null
}): attendance is {
  [key: string]: number
} {
  return !Object.values(attendance).some((value) => value === null)
}

export function AttendancePage() {
  const t = translations.provider.attendance
  const text = useText()
  const { weeks } = attendanceRoute.useLoaderData()
  const { context } = useMatch({ from: '__root__' })
  const router = useRouter()

  const formatDate = useFormatDate()

  const [values, setValues] = useState<{ [key: string]: number | null }>({})
  const [submitted, setSubmitted] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const handleHoursInputChange = useCallback(
    (recordId: string, value: number | null) => {
      setValues((prev) => {
        return { ...prev, [recordId]: value }
      })
    },
    [setValues]
  )

  if (weeks.length === 0) {
    return (
      <div className="p-5">
        <Header Tag="h1" className="text-center">
          <Text text={t.allSet} />
        </Header>
        <p className="text-center">
          <Text text={t.allSetDescription} />
        </p>
        <div className="text-center pt-3">
          <Button asChild>
            <Link to="/provider/home">
              <Text text={t.returnHome} />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitted(true)

    if (!attendanceIsValid(values)) {
      return
    }
    setButtonDisabled(true)

    submitAttendance(values, context)
      .then(() => {
        return router.invalidate()
      })
      .then(() => {
        toast(text(t.success))
      })
      .finally(() => {
        setButtonDisabled(false)
      })
  }

  return (
    <div className="p-5 w-md md:w-2xl mx-auto">
      <Header Tag="h1" className="text-center">
        <Text text={t.header} />
      </Header>
      <p className="text-center">
        <Text text={t.description} />
      </p>
      <form onSubmit={onSubmit}>
        {weeks.map((week: Week) => {
          return (
            <div key={week.range[0].toString()} className="pb-5">
              <p className="text-center text-quaternary py-8">
                <span className="inline-block">
                  {formatDate(week.range[0])}
                </span>
                {' - '}
                <span className="inline-block">
                  {formatDate(week.range[1])}
                </span>
              </p>
              {week.attendance.map((attendanceRecord, i) => {
                return (
                  <Fragment key={attendanceRecord.id}>
                    <AttendanceInput
                      label={`${attendanceRecord.child.firstName} ${attendanceRecord.child.lastName}`}
                      attendanceId={attendanceRecord.id}
                      submitted={submitted}
                      onChange={(value) =>
                        handleHoursInputChange(attendanceRecord.id, value)
                      }
                    />
                    {i < week.attendance.length - 1 && <Separator />}
                  </Fragment>
                )
              })}
            </div>
          )
        })}
        <Button type="submit" className="w-full mt-5" disabled={buttonDisabled}>
          <Text text={t.submit} />
        </Button>
      </form>
    </div>
  )
}

async function submitAttendance(
  attendance: { [key: string]: number },
  context: RouterContext
) {
  const formattedAttendance = Object.entries(attendance).map(
    ([key, hours]) => ({
      id: key,
      hours: hours,
    })
  )

  const res = await fetch(backendUrl('/provider/attendance'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({ attendance: formattedAttendance }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to submit provider attendance: ${res.statusText}`)
  }

  return res.json()
}
