import { Header } from '@/components/header'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import {
  Fragment,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import z from 'zod'
import { FormErrorMessage } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { useHideFamilyNavBar } from '@/lib/hooks'
import type { RouterContext } from '@/routes/router'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import { attendanceRoute } from '../routes'
import { Link, useMatch, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { dateInRange, useFormatDate, weekRange } from '@/lib/dates'
import { Label } from '@/components/ui/label'
import { AttendanceInput } from '@/components/attendance-input'

type ApiResponse = {
  attendance: {
    id: string
    date: string
    child_id: string
    provider_id: string
  }[]
  children: {
    id: string
    first_name: string
    last_name: string
  }[]
  providers: {
    id: string
    name: string
  }[]
}

type Child = {
  id: string
  firstName: string
  lastName: string
}

type Provider = {
  id: string
  name: string
}

type ChildrenWithAttendance = {
  child: Child
  rows: {
    id: string
    provider: Provider
  }[]
}

type Week = {
  range: [Date, Date]
  attendance: ChildrenWithAttendance[]
}

export async function loadAttendance({
  context,
  abortController,
}: {
  context: RouterContext
  abortController: AbortController
}) {
  const res = await fetch(backendUrl('/family/attendance'), {
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

    const provider = rawJson.providers.find(
      (p) => p.id === att_data.provider_id
    )

    if (provider === undefined) {
      throw new Error(
        `Failed to load attendance: provider not found with id ${att_data.provider_id}`
      )
    }

    let childAttendance = week.attendance.find(
      (c) => c.child.id === att_data.child_id
    )

    if (childAttendance === undefined) {
      const child = rawJson.children.find((c) => c.id === att_data.child_id)

      if (child === undefined) {
        throw new Error(
          `Failed to load attendance: child not found with id ${att_data.child_id}`
        )
      }

      childAttendance = {
        child: {
          id: child.id,
          firstName: child.first_name,
          lastName: child.last_name,
        },
        rows: [],
      }
      week.attendance.push(childAttendance)
    }

    childAttendance.rows.push({
      id: att_data.id,
      provider: {
        id: provider.id,
        name: provider.name,
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
  const t = translations.family.attendance
  const text = useText()
  const { weeks } = attendanceRoute.useLoaderData()
  const { context } = useMatch({ from: '__root__' })
  const router = useRouter()
  const formatDate = useFormatDate()

  useHideFamilyNavBar()

  const [values, setValues] = useState<{ [key: string]: number | null }>({})
  const [submitted, setSubmitted] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

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
            <Link to="/family/$childId/home">
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
        {weeks.map((week) => {
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
              {week.attendance.map((child) => {
                return (
                  <ChildAttendance
                    child={child}
                    submitted={submitted}
                    setValues={setValues}
                  />
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

type ChildAttendanceProps = {
  child: ChildrenWithAttendance
  submitted: boolean
  setValues: Dispatch<SetStateAction<{ [key: string]: number | null }>>
}

function ChildAttendance({
  child,
  submitted,
  setValues,
}: ChildAttendanceProps) {
  return (
    <section key={child.child.id}>
      <Header>
        {child.child.firstName} {child.child.lastName}
      </Header>
      {child.rows.map((row, i) => {
        return (
          <Fragment key={row.id}>
            <AttendanceInput
              label={row.provider.name}
              attendanceId={row.id}
              submitted={submitted}
              onChange={(value) => {
                setValues((prev) => {
                  return {
                    ...prev,
                    [row.id]: value,
                  }
                })
              }}
            />
            {i < child.rows.length - 1 && <Separator />}
          </Fragment>
        )
      })}
    </section>
  )
}

async function submitAttendance(
  attendance: { [key: string]: number },
  context: RouterContext
) {
  const formattedAttendance = Object.entries(attendance).map(
    ([key, value]) => ({
      id: key,
      hours: value,
    })
  )

  const res = await fetch(backendUrl('/family/attendance'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({ attendance: formattedAttendance }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to invite provider: ${res.statusText}`)
  }

  return res.json()
}
