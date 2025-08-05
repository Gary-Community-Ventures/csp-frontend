import { Calendar } from '@/components/calendar'
import { allocatedCareDaySchema } from '@/lib/schemas'
import type { GetMonthAllocationResponse } from '@/lib/api/children'
import type { GetPaymentRateResponse } from '@/lib/api/paymentRates'
import { z } from 'zod'

interface CareCalendarProps {
  allocation: GetMonthAllocationResponse | undefined
  setDate: (date: Date) => void
  handleDayTypeChange: (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    type: 'Full Day' | 'Half Day' | 'none',
    selectedDate: Date
  ) => void
  prevMonthAllocationFailed: boolean
  nextMonthAllocationFailed: boolean
  paymentRate: GetPaymentRateResponse
}

export function CareCalendar({ 
  allocation, 
  setDate, 
  handleDayTypeChange, 
  prevMonthAllocationFailed, 
  nextMonthAllocationFailed, 
  paymentRate 
}: CareCalendarProps) {
  return (
    <div className="w-full flex justify-center">
      {allocation && (
        <Calendar
          allocation={allocation}
          onDateChange={setDate}
          onDayTypeChange={handleDayTypeChange}
          prevMonthAllocationFailed={prevMonthAllocationFailed}
          nextMonthAllocationFailed={nextMonthAllocationFailed}
          paymentRate={paymentRate}
        />
      )}
    </div>
  )
}
