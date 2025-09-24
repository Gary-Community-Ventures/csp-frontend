import { useMemo, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthAllocation } from '@/lib/api/children'
import { useFamilyContext } from '../wrapper'
import { familyRoute } from '../routes'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'
import { formatAmount } from '@/lib/currency'

function useMonthBalance(
  context: any,
  childId: string,
  monthOffset: number = 0
) {
  const targetDate = useMemo(() => {
    const now = new Date()
    now.setMonth(now.getMonth() + monthOffset)
    return now
  }, [monthOffset])

  const month = targetDate.getMonth() + 1
  const year = targetDate.getFullYear()

  const {
    data: allocation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['monthAllocation', childId, month, year],
    queryFn: () => getMonthAllocation(context, childId, month, year),
    enabled: !!childId && !!context,
    retry: false,
    throwOnError: false,
  })

  return useMemo(() => {
    if (isError) return 'error'
    if (isLoading || !allocation) return undefined
    return allocation.remaining_unpaid_cents
  }, [allocation, isLoading, isError])
}

function BalanceCard({
  monthOffset,
  isActive,
}: {
  monthOffset: number
  isActive: boolean
}) {
  const t = translations.family.home
  const { selectedChildInfo } = useFamilyContext()
  const context = familyRoute.useRouteContext()
  const balance = useMonthBalance(context, selectedChildInfo.id, monthOffset)

  const monthName = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date.toLocaleDateString('en', { month: 'long' })
  }, [monthOffset])

  return (
    <div
      className={`min-w-full transition-transform duration-300 ${
        isActive ? 'scale-100' : 'scale-95 opacity-75'
      }`}
    >
      <div className="bg-tertiary-background rounded-3xl w-full p-5">
        <div className="text-sm text-center">
          <Text text={t.balance} data={{ month: monthName }} />
        </div>
        <div className="flex items-center justify-center h-20 text-center">
          {balance === undefined ? (
            <div className="flex flex-col items-center justify-center">
              {/* Loading spinner */}
              <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin mb-2"></div>
              <div className="text-stone-600 text-sm">
                <Text text={t.balanceLoading} />
              </div>
            </div>
          ) : balance === 'error' ? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl text-stone-400 mb-1">—</div>
              <div className="text-stone-500 text-sm">
                <Text text={t.balanceUnavailable} />
              </div>
            </div>
          ) : (
            <div className="text-5xl">{formatAmount(balance)}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function BalanceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const months = [0, 1] // Current month and next month

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < months.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleTouchStart = useRef<number>(0)
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const touchStart = handleTouchStart.current
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSwipe('left') // Swiped left, go to next
      } else {
        handleSwipe('right') // Swiped right, go to previous
      }
    }
  }

  return (
    <section className="px-5 pt-5">
      <div
        className="relative"
        onTouchStart={(e) => (handleTouchStart.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {months.map((monthOffset, index) => (
              <BalanceCard
                key={monthOffset}
                monthOffset={monthOffset}
                isActive={index === currentIndex}
              />
            ))}
          </div>
        </div>

        {/* Navigation arrows - centered on the card */}
        <div className="hidden md:block">
          <button
            onClick={() => handleSwipe('right')}
            disabled={currentIndex === 0}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed'
                : 'opacity-80 hover:opacity-100 cursor-pointer'
            }`}
            style={{ top: 'calc(50% - 12px)' }} // Adjust for navigation dots space
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleSwipe('left')}
            disabled={currentIndex === months.length - 1}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 ${
              currentIndex === months.length - 1
                ? 'opacity-40 cursor-not-allowed'
                : 'opacity-80 hover:opacity-100 cursor-pointer'
            }`}
            style={{ top: 'calc(50% - 12px)' }} // Adjust for navigation dots space
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-3 space-x-2">
          {months.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer hover:scale-110 ${
                index === currentIndex
                  ? 'bg-gray-800'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
