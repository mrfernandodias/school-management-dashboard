'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// Sample events data
const events = [
  {
    id: 1,
    title: 'Reunião de Planejamento',
    time: '09:00 AM - 10:30 AM',
    description: 'Reunião trimestral para planejamento do próximo período letivo',
  },
  {
    id: 2,
    title: 'Prova de Matemática',
    time: '02:00 PM - 04:00 PM',
    description: 'Avaliação bimestral de cálculo e álgebra',
  },
  {
    id: 3,
    title: 'Palestra sobre Tecnologia',
    time: '10:00 AM - 12:00 PM',
    description: 'Palestra sobre inovações tecnológicas na educação',
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      <div className="bg-white rounded-lg p-4">
        <Calendar onChange={handleDateClick} value={value} />

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
            {events.map(event => (
              <div
                className="p-4 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple hover:shadow-sm transition-shadow cursor-pointer"
                key={event.id}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-600">{event.title}</h2>
                  <span className="text-xs text-gray-300">{event.time}</span>
                </div>
                <p className="text-sm text-gray-400">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
