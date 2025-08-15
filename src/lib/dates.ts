import { useLanguageContext } from '@/translations/wrapper'

const TUESDAY_DAY_NUMBER = 2
const DAYS_IN_WEEK = 7

export function weekRange(date: Date): [Date, Date] {
  date.getUTCDay()

  const tuesdayDate = new Date(date.getTime())
  tuesdayDate.setHours(0, 0, 0, 0)
  while (tuesdayDate.getDay() !== TUESDAY_DAY_NUMBER) {
    tuesdayDate.setDate(tuesdayDate.getDate() - 1)
  }

  const endOfWeekDate = new Date(tuesdayDate.getTime())
  endOfWeekDate.setDate(endOfWeekDate.getDate() + DAYS_IN_WEEK)
  endOfWeekDate.setMilliseconds(endOfWeekDate.getMilliseconds() - 1) // get previous day

  return [tuesdayDate, endOfWeekDate]
}

export function dateInRange(date: Date, [start, end]: [Date, Date]) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
}

export function useFormatDate() {
  const { lang } = useLanguageContext()

  return (date: Date) => {
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }
}
