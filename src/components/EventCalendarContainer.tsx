import Image from 'next/image';
import EventCalendar from '@/components/EventCalendar';
import EventList from '@/components/EventList';

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white rounded-lg p-4">
      <EventCalendar />

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Upcoming Events</h1>
          <Image
            src="/moreDark.png"
            alt=""
            width={20}
            height={20}
            draggable={false}
            className="select-none cursor-pointer hover:opacity-70 transition-opacity"
          />
        </div>
        <div className="flex flex-col gap-4">
          <EventList dateParam={date} />
        </div>
      </div>
    </div>
  );
};
export default EventCalendarContainer;
