'use client';
import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useRouter } from 'next/navigation';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      // Formato ISO: YYYY-MM-DD
      const dateStr = value.toISOString().split('T')[0];
      router.push(`?date=${dateStr}`);
    }
  }, [value, router]);

  const handleDateClick = (date: Value) => {
    onChange(date);
    if (date instanceof Date) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <>
      <Calendar onChange={onChange} value={value} />
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedDate?.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 text-2xl transition-colors hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-lamaSkyLight rounded-lg">
                <p className="font-medium">Event 1</p>
                <p className="text-sm text-gray-500">12:00 PM - 1:00 PM</p>
              </div>
              <div className="p-3 bg-lamaPurpleLight rounded-lg">
                <p className="font-medium">Event 2</p>
                <p className="text-sm text-gray-500">2:00 PM - 3:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCalendar;
