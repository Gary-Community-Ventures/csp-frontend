import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  allocatedCareDaySchema,
  monthAllocationSchema,
  paymentRateSchema,
} from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'
import { Button } from './ui/button'
import { z } from 'zod'
import { useBlocker } from '@tanstack/react-router'

interface CalendarProps {
  allocation: z.infer<typeof monthAllocationSchema>
  onDateChange: (date: Date) => void
  onSubmit: () => void
  onDayTypeChange: (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    type: 'Full Day' | 'Half Day' | 'none',
    selectedDate: Date
  ) => void
  prevMonthAllocationFailed: boolean
  nextMonthAllocationFailed: boolean
  paymentRate: z.infer<typeof paymentRateSchema> | null
}

export const Calendar: React.FC<CalendarProps> = ({
  allocation,
  onDateChange,
  onSubmit,
  onDayTypeChange,
  prevMonthAllocationFailed,
  nextMonthAllocationFailed,
  paymentRate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const MIN_DATE = new Date(2025, 6, 1) // July 1, 2025 (Month is 0-indexed)
  const today = new Date()

  const handleDayClick = (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    date: Date
  ) => {
    if (day?.is_locked) return

    if (day) {
      if (day.type === 'Half Day') {
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
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(startDate.getDate() - daysToSubtract)

  const days: Date[] = []
  let day = new Date(startDate)
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
    const dayStr = d.toISOString().split('T')[0]
    const careDay = allocation.care_days.find((cd) => cd.date === dayStr)
    const isCurrentMonth = d.getMonth() === currentDate.getMonth()
    const isToday = new Date().toDateString() === d.toDateString()

    const currentDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    let lockedUntilDateStart: Date | null = null
    if (allocation.locked_until_date) {
      const [year, month, day] = allocation.locked_until_date
        .split('-')
        .map(Number)
      lockedUntilDateStart = new Date(year, month - 1, day) // month is 0-indexed
    }

    const isDayLocked =
      careDay?.is_locked ||
      (lockedUntilDateStart && currentDayStart <= lockedUntilDateStart)

    let dayClasses = `w-10 h-10 rounded-full flex items-center justify-center relative text-sm ${
      isCurrentMonth && !isDayLocked
        ? 'cursor-pointer hover:opacity-80'
        : 'cursor-not-allowed'
    }`
    let innerHalfDayClass = ''
    let textColorClass = 'text-gray-800'
    let borderColorClass = ''

    if (!isCurrentMonth) {
      textColorClass = 'text-gray-300'
    } else if (isDayLocked) {
      dayClasses += ' bg-gray-200'
      textColorClass = 'text-gray-400'
    } else if (careDay) {
      if (careDay.type === 'Half Day') {
        switch (careDay.status) {
          case 'new':
            dayClasses += ' bg-blue-100' // Lighter background for the full circle
            innerHalfDayClass = 'bg-blue-200' // Main color for the half
            break
          case 'submitted':
            dayClasses += ' bg-secondary-background' // Neutral lighter background for submitted half-day
            innerHalfDayClass = 'bg-primary' // Main color for the half
            textColorClass = 'text-primary-foreground'
            borderColorClass = 'border-2 border-primary-foreground'
            break
          case 'needs_resubmission':
            dayClasses += ' bg-yellow-100'
            innerHalfDayClass = 'bg-yellow-200'
            break
          case 'deleted':
            console.log('careDay', careDay)
            console.log('last_submitted_at', careDay.last_submitted_at)
            console.log('deleted_at', careDay.deleted_at)

            if (
              careDay.last_submitted_at &&
              careDay.deleted_at &&
              new Date(careDay.deleted_at) > new Date(careDay.last_submitted_at)
            ) {
              console.log(
                new Date(careDay.deleted_at) >
                  new Date(careDay.last_submitted_at)
              )
              dayClasses += ' bg-gray-50' // Lighter background for the full circle
              innerHalfDayClass = 'bg-red-500' // Red for deleted and previously submitted
              textColorClass = 'text-white'
            } else {
              dayClasses += ' bg-gray-50'
              innerHalfDayClass = 'bg-gray-100' // Default gray for deleted but not submitted
            }
            break
          default:
            dayClasses += ' bg-gray-50'
            innerHalfDayClass = 'bg-gray-100'
        }
      } else {
        // Full Day
        switch (careDay.status) {
          case 'new':
            dayClasses += ' bg-[#b8c9be]'
            break
          case 'submitted':
            dayClasses += ' bg-primary'
            textColorClass = 'text-primary-foreground'
            borderColorClass = 'border-2 border-primary-foreground'
            break
          case 'needs_resubmission':
            dayClasses += ' bg-yellow-200'
            break
          case 'deleted':
            if (careDay.last_submitted_at) {
              dayClasses += ' bg-[#b33363]' // Red for deleted and previously submitted
              textColorClass = 'text-white'
            } else {
              dayClasses += ' bg-gray-100' // Default gray for deleted but not submitted
            }
            break
          default:
            dayClasses += ' bg-gray-100'
        }
      }
    } else {
      dayClasses += ' bg-gray-100'
    }

    if (isToday) {
      borderColorClass = 'border-4 border-tertiary-background'
    }

    dayClasses += ` ${borderColorClass}`

    const dayContent = (
      <>
        {careDay?.type === 'Half Day' && (
          <div
            className={`absolute left-0 top-0 h-full w-1/2 rounded-l-full ${innerHalfDayClass}`}
          ></div>
        )}
        <span className={`relative z-10 font-medium ${textColorClass}`}>
          {d.getDate()}
        </span>
      </>
    )

    if (isDayLocked) {
      return (
        <div key={d.toString()} className={dayClasses}>
          {dayContent}
        </div>
      )
    } else {
      return (
        <div
          key={d.toString()}
          className={dayClasses}
          onClick={() => handleDayClick(careDay, d)}
        >
          {dayContent}
        </div>
      )
    }
  }

  const hasPendingChanges = allocation.care_days.some(
    (careDay) =>
      careDay.status === 'new' ||
      careDay.status === 'needs_resubmission' ||
      careDay.status === 'deleted'
  )

  useBlocker(
    () => hasPendingChanges,
    'You have unsaved changes. Are you sure you want to leave?'
  )

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl mx-auto select-none">
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Tap once for half day, twice for full day, three times to remove.</p>
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
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 text-center py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day) => (
              <div
                className="flex justify-center items-center py-1"
                key={day.toISOString()}
              >
                {renderDay(day)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button type="button" onClick={onSubmit} disabled={!hasPendingChanges}>
          Submit
        </Button>
      </div>
      <div className="mt-6 flex justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-200"></div>
          <span>
            Needs Submission
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground"></div>
          <span>Submitted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-yellow-200"></div>
          <span>Needs Resubmission</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar