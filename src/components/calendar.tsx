import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Selection = 'none' | 'half' | 'full';

const Calendar: React.FC<{ maxSelection: number }> = ({ maxSelection }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<Record<string, Record<string, Selection>>>({});

  const getCurrentMonthKey = () => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  };

  const getCurrentMonthSelections = () => {
    return selectedDays[getCurrentMonthKey()] || {};
  };

  const totalSelected = Object.values(getCurrentMonthSelections()).reduce((acc, val) => {
    if (val === 'half') return acc + 0.5;
    if (val === 'full') return acc + 1;
    return acc;
  }, 0);

  const handleDayClick = (day: Date) => {
    const dayStr = day.toISOString().split('T')[0];
    const monthKey = getCurrentMonthKey();
    const currentMonthSelections = getCurrentMonthSelections();
    const currentSelection = currentMonthSelections[dayStr] || 'none';
    let newSelection: Selection = 'none';

    if (currentSelection === 'none') {
      newSelection = 'half';
    } else if (currentSelection === 'half') {
      newSelection = 'full';
    } else {
      newSelection = 'none';
    }

    const currentValue = currentSelection === 'half' ? 0.5 : currentSelection === 'full' ? 1 : 0;
    const newValue = newSelection === 'half' ? 0.5 : newSelection === 'full' ? 1 : 0;
    const newTotal = totalSelected - currentValue + newValue;

    if (newTotal > maxSelection) {
      return; // Do not update if exceeding max selection
    }

    const updatedMonthSelections = { ...currentMonthSelections, [dayStr]: newSelection };
    setSelectedDays({ ...selectedDays, [monthKey]: updatedMonthSelections });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Start from Monday of the week containing the first day of the month
  const startDate = new Date(startOfMonth);
  const dayOfWeek = startDate.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday = 0
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const days: Date[] = [];
  let day = new Date(startDate);
  // Continue until we've covered all days of the month and completed full weeks
  while (day <= endOfMonth || (days.length > 0 && days.length % 7 !== 0)) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
    if (days.length > 42) break; // prevent infinite loop
  }

  const canNavigateToNextMonth = () => {
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Always allow navigation to past months
    if (nextMonthDate.getFullYear() < now.getFullYear() || 
        (nextMonthDate.getFullYear() === now.getFullYear() && nextMonthDate.getMonth() < now.getMonth())) {
      return true;
    }
    
    // Allow navigation to current month
    if (nextMonthDate.getFullYear() === now.getFullYear() && nextMonthDate.getMonth() === now.getMonth()) {
      return true;
    }
    
    // For future months, find the last week that has current month days but no next month days
    if (nextMonthDate.getFullYear() === now.getFullYear() && nextMonthDate.getMonth() === now.getMonth() + 1) {
      const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      
      // Start from first Monday of current month view
      const startDate = new Date(currentMonthStart);
      const dayOfWeek = startDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(startDate.getDate() - daysToSubtract);
      
      let lastRelevantMonday = null;
      let weekStart = new Date(startDate);
      
      while (weekStart <= currentMonthEnd) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        // Check if this week contains current month days
        const hasCurrentMonthDays = weekStart <= currentMonthEnd && weekEnd >= currentMonthStart;
        // Check if this week contains next month days
        const hasNextMonthDays = weekEnd >= nextMonthStart;
        
        // We want the last week that has current month days but no next month days
        if (hasCurrentMonthDays && !hasNextMonthDays) {
          lastRelevantMonday = new Date(weekStart);
        }
        
        weekStart.setDate(weekStart.getDate() + 7);
      }
      
      // Check if that Monday has passed
      return lastRelevantMonday && now > lastRelevantMonday;
    }
    
    return false;
  };

  const nextMonth = () => {
    if (!canNavigateToNextMonth()) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  const isWeekLocked = (d: Date) => {
    const monday = getMonday(d);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // Week is locked starting Tuesday after the Monday
    const tuesday = new Date(monday);
    tuesday.setDate(tuesday.getDate() + 1);
    return now >= tuesday;
  };

  const renderDay = (d: Date) => {
    const dayStr = d.toISOString().split('T')[0];
    const currentMonthSelections = getCurrentMonthSelections();
    const selection = currentMonthSelections[dayStr] || 'none';
    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
    const isToday = new Date().toDateString() === d.toDateString();
    const isLocked = isWeekLocked(d);

    // For now, allow selection of any day in the current displayed month that's not locked
    const canClick = isCurrentMonth && !isLocked;

    // Base styling
    let bgColor = '';
    let textColor = 'text-gray-800';
    
    if (!isCurrentMonth) {
      textColor = 'text-gray-300';
    } else if (isLocked) {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-400';
    } else {
      // Selection colors for current month, unlocked days
      if (selection === 'half') {
        bgColor = 'bg-gradient-to-r from-secondary-background from-50% to-gray-100 to-50%';
        textColor = 'text-white';
      } else if (selection === 'full') {
        bgColor = 'bg-primary';
        textColor = 'text-white';
      } else {
        bgColor = 'bg-gray-100';
      }
    }

    return (
      <div
        key={d.toString()}
        className={`w-8 h-8 rounded-full flex items-center justify-center relative text-sm ${bgColor} ${textColor} ${
          canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
        }`}
        onClick={() => canClick && handleDayClick(d)}
      >
        {/* Today indicator */}
        {isToday && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
        
        {/* Day number */}
        <span className="relative z-10 font-medium">{d.getDate()}</span>
      </div>
    );
  };

  // Group days into weeks for easier rendering
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto select-none">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className={`p-2 rounded-full transition-colors ${
            canNavigateToNextMonth() 
              ? 'hover:bg-gray-100' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {/* Days of week header */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="text-xs font-medium text-gray-500 text-center py-2">
            🔒 Closes
          </div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        {weeks.map((week, weekIndex) => {
          const monday = getMonday(week[0]);
          const isLocked = isWeekLocked(week[0]);
          
          return (
            <div key={weekIndex} className="grid grid-cols-8 gap-1">
              {/* Lock date column */}
              <div className={`text-xs text-center py-2 font-medium flex items-center justify-center h-8 ${
                isLocked ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[9px] opacity-75">Closes</span>
                  <span className="text-[10px]">Tuesday</span>
                </div>
              </div>
              
              {/* Days of the week */}
              {week.map(day => renderDay(day))}
            </div>
          );
        })}
      </div>

      {/* Selection counter */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Selected Days: <span className="font-medium">{totalSelected} / {maxSelection}</span>
        </p>
      </div>
    </div>
  );
};

// Demo component
export default function CalendarDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Calendar Selection</h1>
        <Calendar maxSelection={10} />
      </div>
    </div>
  );
}