'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventType = 'exam' | 'meeting' | 'holiday' | 'activity';

type Event = {
  id: number;
  title: string;
  time: string;
  date: Date;
  type: EventType;
  attendees?: number;
  confirmed?: string[];
};

// Eventos de exemplo com tipos
const events: Event[] = [
  {
    id: 1,
    title: 'Math Exam',
    time: '10:00 AM - 12:00 PM',
    date: new Date(2025, 11, 30),
    type: 'exam',
  },
  {
    id: 2,
    title: 'Team Meeting',
    time: '2:00 PM - 3:00 PM',
    date: new Date(2025, 11, 30),
    type: 'meeting',
    attendees: 15,
    confirmed: ['user1', 'user2'],
  },
  {
    id: 3,
    title: 'Science Fair',
    time: '9:00 AM - 5:00 PM',
    date: new Date(2026, 0, 5),
    type: 'activity',
    attendees: 50,
    confirmed: [],
  },
  {
    id: 4,
    title: 'New Year Holiday',
    time: 'All Day',
    date: new Date(2026, 0, 1),
    type: 'holiday',
  },
  {
    id: 5,
    title: 'Parent-Teacher Conference',
    time: '3:00 PM - 5:00 PM',
    date: new Date(2026, 0, 10),
    type: 'meeting',
    attendees: 30,
    confirmed: ['user1'],
  },
  {
    id: 6,
    title: 'Sports Day',
    time: '8:00 AM - 4:00 PM',
    date: new Date(2026, 0, 15),
    type: 'activity',
    attendees: 100,
    confirmed: [],
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [confirmedEvents, setConfirmedEvents] = useState<number[]>([]);

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

  const goToToday = () => {
    const today = new Date();
    onChange(today);
  };

  const goToNextEvent = () => {
    const today = new Date();
    const futureEvents = events
      .filter(e => e.date > today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    if (futureEvents.length > 0) {
      onChange(futureEvents[0].date);
    }
  };

  const toggleConfirmation = (eventId: number) => {
    setConfirmedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      event =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventTypeColor = (type: EventType) => {
    const colors = {
      exam: 'bg-red-500',
      meeting: 'bg-blue-500',
      holiday: 'bg-green-500',
      activity: 'bg-yellow-500',
    };
    return colors[type];
  };

  const getEventTypeBgColor = (type: EventType) => {
    const colors = {
      exam: 'bg-red-100',
      meeting: 'bg-blue-100',
      holiday: 'bg-green-100',
      activity: 'bg-yellow-100',
    };
    return colors[type];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const tileContent = ({ date, view: calView }: { date: Date; view: string }) => {
    if (calView === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="flex flex-col items-center mt-1">
            {/* Badge com número */}
            <div className="bg-lamaSky text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {dayEvents.length}
            </div>
            {/* Pontos coloridos por tipo */}
            <div className="flex gap-0.5 mt-0.5">
              {Array.from(new Set(dayEvents.map(e => e.type))).map(type => (
                <div key={type} className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(type)}`} />
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    const classes = [];

    if (isToday(date)) {
      classes.push('!bg-lamaPurpleLight !font-bold');
    }

    if (dayEvents.some(e => e.type === 'exam')) {
      classes.push('!border-2 !border-red-300');
    }

    if (dayEvents.some(e => e.type === 'holiday')) {
      classes.push('!bg-green-50');
    }

    return classes.join(' ');
  };

  const dayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <>
      <div className="bg-white rounded-lg p-4">
        {/* Header com controles */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Calendário</h2>
          <div className="flex gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs bg-lamaSky text-white rounded-md hover:bg-opacity-80"
            >
              Hoje
            </button>
            <button
              onClick={goToNextEvent}
              className="px-3 py-1 text-xs bg-lamaPurple text-white rounded-md hover:bg-opacity-80"
            >
              Próximo
            </button>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Prova</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Reunião</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Feriado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Atividade</span>
          </div>
        </div>

        <Calendar
          onChange={handleDateClick}
          value={value}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
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
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {dayEvents.length > 0 ? (
                dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg ${getEventTypeBgColor(event.type)} border-l-4 ${getEventTypeColor(event.type).replace('bg-', 'border-')}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white rounded-full">{event.type}</span>
                    </div>

                    {event.attendees && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span>👥 {event.attendees} participantes</span>
                        {event.confirmed && (
                          <span className="text-green-600">
                            ✓ {event.confirmed.length} confirmados
                          </span>
                        )}
                      </div>
                    )}

                    {event.type !== 'holiday' && event.type !== 'exam' && (
                      <button
                        onClick={() => toggleConfirmation(event.id)}
                        className={`mt-3 w-full py-2 rounded-md text-sm font-medium transition-colors ${
                          confirmedEvents.includes(event.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {confirmedEvents.includes(event.id) ? '✓ Confirmado' : 'Confirmar Presença'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum evento neste dia</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCalendar;
