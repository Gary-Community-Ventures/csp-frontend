import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  allocatedCareDaySchema,
  monthAllocationSchema,
  paymentRateSchema,
} from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'
import { z } from 'zod'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'

interface CalendarProps {
  allocation: z.infer<typeof monthAllocationSchema>
  onDateChange: (date: Date) => void
  onDayTypeChange: (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    type: 'Full Day' | 'Half Day' | 'none',
    selectedDate: Date
  ) => void
  prevMonthAllocationFailed: boolean
  nextMonthAllocationFailed: boolean
  paymentRate: z.infer<typeof paymentRateSchema> | null
}

const getDayStyles = (status: string) => {
  const baseStyles = {
    colorClasses: '',
    innerHalfDayClass: '',
    textColorClass: 'text-gray-800',
    showX: false,
    xColorClass: '',
  }

  const statusStyles: { [key: string]: Partial<typeof baseStyles> } = {
    new: {
      colorClasses: 'bg-tertiary-background',
    },
    submitted: {
      colorClasses: 'bg-[#778C7F]',
    },
    needs_resubmission: {
      colorClasses: 'bg-tertiary-background',
    },
    delete_not_submitted: {
      colorClasses: 'bg-transparent',
      xColorClass: 'text-[#b33363]',
      showX: true,
    },
    default: { colorClasses: 'bg-gray-100' },
  }

  return { ...baseStyles, ...(statusStyles[status] || statusStyles.default) }
}

interface CalendarDayProps {
  d: Date
  allocation: z.infer<typeof monthAllocationSchema>
  currentDate: Date
  MIN_DATE: Date
  handleDayClick: (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    date: Date
  ) => void
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  d,
  allocation,
  currentDate,
  handleDayClick,
}) => {
  const dayStr = d.toISOString().split('T')[0]
  const careDay = allocation.care_days.find((cd) => cd.date === dayStr)
  const isCurrentMonth = d.getMonth() === currentDate.getMonth()
  const isToday = new Date().toDateString() === d.toDateString()

  const currentDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  let lockedUntilDateStart: Date | null = null
  let lockedPastDateStart: Date | null = null
  if (allocation.locked_until_date) {
    const [year, month, day] = allocation.locked_until_date
      .split('-')
      .map(Number)
    lockedUntilDateStart = new Date(year, month - 1, day) // month is 0-indexed
  }
  if (allocation.locked_past_date) {
    const [year, month, day] = allocation.locked_past_date
      .split('-')
      .map(Number)
    lockedPastDateStart = new Date(year, month - 1, day) // month is 0-indexed
  }

  const isDayLocked =
    careDay?.is_locked ||
    (lockedUntilDateStart && currentDayStart <= lockedUntilDateStart) ||
    (lockedPastDateStart && currentDayStart >= lockedPastDateStart)

  let cellClasses = 'flex justify-center items-center py-1'

  let isDisabled = !isCurrentMonth || isDayLocked || careDay?.last_submitted_at

  let dayClasses = `w-10 h-10 rounded-full flex items-center justify-center relative text-sm ${
    !isDisabled ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
  }`
  let colorClass = ''
  let textColorClass = 'text-gray-800' // Default text color
  let showX = false
  let xColorClass = ''

  if (!isCurrentMonth) {
    textColorClass = 'text-gray-300'
    dayClasses += ' bg-gray-100' // Default background for non-current month days
  } else if (careDay) {
    const styles = getDayStyles(careDay.status)
    if (careDay?.type === 'Half Day') {
      dayClasses += ' bg-gray-100' // Half Day background
    } else {
      dayClasses += ` ${styles.colorClasses}` // Apply status-specific background
    }
    colorClass = styles.colorClasses
    textColorClass = styles.textColorClass
    showX = styles.showX
    xColorClass = styles.xColorClass
  } else {
    dayClasses += ' bg-gray-100' // Default background for empty days
  }

  // Apply locked styling *after* status styling
  if (isDayLocked) {
    dayClasses += ' bg-gray-200 bg-opacity-70' // Add grey background and slight opacity to show original color underneath
    cellClasses += ' cursor-not-allowed bg-gray-50'
  }

  if (isToday) {
    dayClasses += ' border-4 border-primary'
  }

  const dayContent = (
    <>
      {showX && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${xColorClass}`}
        >
          X
        </div>
      )}
      {careDay?.type === 'Half Day' && (
        <div
          className={`absolute left-0 top-0 h-full w-1/2 rounded-l-full ${colorClass}`}
        ></div>
      )}
      <span className={`relative z-10 font-medium ${textColorClass}`}>
        {d.getDate()}
      </span>
    </>
  )

  return (
    <div className={cellClasses}>
      <div
        key={d.toString()}
        className={dayClasses}
        onClick={!isDisabled ? () => handleDayClick(careDay, d) : undefined}
      >
        {dayContent}
      </div>
    </div>
  )
}

export const Calendar: React.FC<CalendarProps> = ({
  allocation,
  onDateChange,
  onDayTypeChange,
  prevMonthAllocationFailed,
  nextMonthAllocationFailed,
  paymentRate,
}) => {
  const t = translations.family.calendar
  const [currentDate, setCurrentDate] = useState(new Date())
  const MIN_DATE = new Date(2025, 6, 1) // July 1, 2025 (Month is 0-indexed)xw

  const handleDayClick = (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    date: Date
  ) => {
    if (day?.is_locked) {
      return
    }

    if (day) {
      if (day.is_deleted) {
        onDayTypeChange(null, 'Half Day', date)
      } else if (day.type === 'Half Day') {
        onDayTypeChange(day, 'Full Day', date)
      } else {
        onDayTypeChange(day, 'none', date)
      }
    } else {
      onDayTypeChange(null, 'Half Day', date)
    }
  }

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  const startDate = new Date(startOfMonth)
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek)

  const days: Date[] = []
  const day = new Date(startDate)
  while (day <= endOfMonth || (days.length > 0 && days.length % 7 !== 0)) {
    days.push(new Date(day))
    day.setDate(day.getDate() + 1)
    if (days.length > 42) break // prevent infinite loop
  }

  const nextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    )
    setCurrentDate(newDate)
    onDateChange(newDate)
  }

  const prevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
    if (newDate < MIN_DATE) {
      return
    }
    setCurrentDate(newDate)
    onDateChange(newDate)
  }

  const canGoPrev = !prevMonthAllocationFailed
  const canGoNext = !nextMonthAllocationFailed

  const renderDay = (d: Date) => {
    return (
      <CalendarDay
        d={d}
        allocation={allocation}
        currentDate={currentDate}
        MIN_DATE={MIN_DATE}
        handleDayClick={handleDayClick}
      />
    )
  }

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl mx-auto select-none">
      <div className="flex justify-center items-center mb-2 text-sm font-medium space-x-2">
        <span>
          <Text text={t.halfDay} />{' '}
          {formatAmount(paymentRate?.half_day_rate_cents || 0)}
        </span>
        <span>•</span>
        <span>
          <Text text={t.fullDay} />{' '}
          {formatAmount(paymentRate?.full_day_rate_cents || 0)}
        </span>
      </div>
      <div className="text-center text-sm text-gray-500 mb-4">
        <Text text={t.tapInstructions} />
      </div>
      <div className="flex items-center justify-between mb-6">
        {canGoPrev ? (
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        {canGoNext ? (
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {[
            t.daysOfWeek.sun,
            t.daysOfWeek.mon,
            t.daysOfWeek.tue,
            t.daysOfWeek.wed,
            t.daysOfWeek.thu,
            t.daysOfWeek.fri,
            t.daysOfWeek.sat,
          ].map((day) => (
            <div
              key={day.en}
              className="text-xs font-medium text-gray-500 text-center py-2"
            >
              <Text text={day} />
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day) => (
              <div className="" key={day.toISOString()}>
                {renderDay(day)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:flex md:justify-center md:space-x-4">
        {[
          {
            colorClass: 'bg-tertiary-background',
            textKey: t.needsSubmission,
          },
          {
            colorClass: 'bg-[#778C7F]',
            textKey: t.submitted,
          },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-x-2">
            <div className={`w-4 h-4 rounded-full ${item.colorClass}`}></div>
            <Text text={item.textKey} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
