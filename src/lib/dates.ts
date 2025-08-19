import { useLanguageContext } from '@/translations/wrapper'

const WEEK_START_DAY_NUMBER = 1
const DAYS_IN_WEEK = 7

export function weekRange(date: Date): [Date, Date] {
  date.getUTCDay()

  const utcWeekStartDate = new Date(date.getTime())
  utcWeekStartDate.setUTCHours(0, 0, 0, 0)
  while (utcWeekStartDate.getUTCDay() !== WEEK_START_DAY_NUMBER) {
    utcWeekStartDate.setUTCDate(utcWeekStartDate.getUTCDate() - 1)
  }

  const utcEndOfWeekDate = new Date(utcWeekStartDate.getTime())
  utcEndOfWeekDate.setUTCDate(utcEndOfWeekDate.getUTCDate() + DAYS_IN_WEEK)
  utcEndOfWeekDate.setUTCMilliseconds(utcEndOfWeekDate.getUTCMilliseconds() - 1) // get previous day


  return [utcWeekStartDate, utcEndOfWeekDate]
}

export function dateInRange(date: Date, [start, end]: [Date, Date]) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
}

export function useFormatDate() {
  const { lang } = useLanguageContext()

  return (date: Date) => {
    const localDate = convertToLocalDate(date)

    return localDate.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }
}

export function convertToLocalDate(date: Date) {
  const localDate = new Date()
  localDate.setHours(0, 0, 0, 0)
  localDate.setFullYear(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )

  return localDate
}
