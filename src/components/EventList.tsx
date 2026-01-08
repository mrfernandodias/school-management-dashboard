import prisma from '@/lib/prisma';

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.events.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">Nenhum evento para este dia.</div>
    );
  }

  return data.map(event => (
    <div
      className="p-4 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple hover:shadow-sm transition-shadow cursor-pointer"
      key={event.id}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gray-600">{event.title}</h2>
        <span className="text-xs text-gray-300">
          {event.startTime.toLocaleDateString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>
      </div>
      <p className="text-sm text-gray-400">{event.description}</p>
    </div>
  ));
};
export default EventList;
