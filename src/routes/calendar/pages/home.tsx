import Calendar from '@/components/calendar';

const CalendarPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar Demo</h1>
      <Calendar maxSelection={5} />
    </div>
  );
};

export default CalendarPage;
