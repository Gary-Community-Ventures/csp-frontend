import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { allocatedCareDaySchema, monthAllocationSchema } from '@/lib/schemas';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { z } from 'zod';

interface CalendarProps {
  allocation: z.infer<typeof monthAllocationSchema>;
  onDateChange: (date: Date) => void;
  onSubmit: () => void;
  onDayTypeChange: (day: z.infer<typeof allocatedCareDaySchema> | null | undefined, type: 'Full Day' | 'Half Day' | 'none', selectedDate: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ allocation, onDateChange, onSubmit, onDayTypeChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const MIN_DATE = new Date(2025, 6, 1); // July 1, 2025 (Month is 0-indexed)
  const today = new Date();

  const handleDayClick = (day: z.infer<typeof allocatedCareDaySchema> | null, date: Date) => {
    if (day?.is_locked) return;

    // The popover will handle the day type change
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDate = new Date(startOfMonth);
  const dayOfWeek = startDate.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endOfMonth || (days.length > 0 && days.length % 7 !== 0)) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
    if (days.length > 42) break; // prevent infinite loop
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (newDate.getFullYear() > sevenDaysFromNow.getFullYear() ||
        (newDate.getFullYear() === sevenDaysFromNow.getFullYear() && newDate.getMonth() > sevenDaysFromNow.getMonth())) {
      return;
    }

    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (newDate < MIN_DATE) {
      return;
    }
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const canGoPrev = currentDate.getFullYear() > MIN_DATE.getFullYear() ||
    (currentDate.getFullYear() === MIN_DATE.getFullYear() && currentDate.getMonth() > MIN_DATE.getMonth());

  const nextMonthCandidate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const canGoNext = nextMonthCandidate.getFullYear() < sevenDaysFromNow.getFullYear() ||
    (nextMonthCandidate.getFullYear() === sevenDaysFromNow.getFullYear() && nextMonthCandidate.getMonth() <= sevenDaysFromNow.getMonth());

  const renderDay = (d: Date) => {
    const dayStr = d.toISOString().split('T')[0];
    const careDay = allocation.care_days.find((cd) => cd.date === dayStr);
    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
    const isToday = new Date().toDateString() === d.toDateString();

    const currentDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let lockedUntilDateStart: Date | null = null;
    if (allocation.locked_until_date) {
      const [year, month, day] = allocation.locked_until_date.split('-').map(Number);
      lockedUntilDateStart = new Date(year, month - 1, day); // month is 0-indexed
    }

    const isDayLocked = careDay?.is_locked || (lockedUntilDateStart && currentDayStart <= lockedUntilDateStart);

    let bgColor = '';
    let textColor = 'text-gray-800';

    if (!isCurrentMonth) {
      textColor = 'text-gray-300';
    } else if (isDayLocked) {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-400';
    } else if (careDay) {
      switch (careDay.status) {
        case 'new':
          bgColor = 'bg-blue-200';
          break;
        case 'submitted':
          bgColor = 'bg-green-200';
          break;
        case 'needs_resubmission':
          bgColor = 'bg-yellow-200';
          break;
        case 'deleted':
          bgColor = 'bg-red-200';
          break;
        default:
          bgColor = 'bg-gray-100';
      }
    } else {
      bgColor = 'bg-gray-100';
    }

    if (isDayLocked) {
      return (
        <div
          key={d.toString()}
          className={`w-8 h-8 rounded-full flex items-center justify-center relative text-sm ${bgColor} ${textColor} ${
            isCurrentMonth && !isDayLocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
          }`}
        >
          {isToday && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          <span className="relative z-10 font-medium">{d.getDate()}</span>
        </div>
      );
    } else {
      return (
        <Popover key={dayStr}>
          <PopoverTrigger asChild>
            <div
              key={d.toString()}
              className={`w-8 h-8 rounded-full flex items-center justify-center relative text-sm ${bgColor} ${textColor} ${
                isCurrentMonth && !isDayLocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
              }`}
              onClick={() => handleDayClick(careDay || null, d)}
            >
              {isToday && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              <span className="relative z-10 font-medium">{d.getDate()}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="flex flex-col space-y-2">
              <Button onClick={() => onDayTypeChange(careDay, 'Full Day', d)}>Full Day</Button>
              <Button onClick={() => onDayTypeChange(careDay, 'Half Day', d)}>Half Day</Button>
              <Button variant="destructive" onClick={() => onDayTypeChange(careDay, 'none', d)}>Clear</Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
  };

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto select-none">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          disabled={!canGoPrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          disabled={!canGoNext}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map(day => renderDay(day))}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button type="button" onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default Calendar;