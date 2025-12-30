const announcements = [
  {
    id: 1,
    title: 'Período de Matrículas Abertas',
    date: '2025-01-15',
    description: 'As matrículas para o próximo semestre estão abertas até 31 de janeiro.',
  },
  {
    id: 2,
    title: 'Atualização no Sistema de Notas',
    date: '2025-01-10',
    description: 'O sistema de notas passará por manutenção no dia 20/01 das 8h às 12h.',
  },
  {
    id: 3,
    title: 'Evento de Integração',
    date: '2025-01-05',
    description: 'Participe do evento de integração entre alunos e professores no dia 25/01.',
  },
];

const Announcements = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        {announcements.map(announcement => (
          <div
            key={announcement.id}
            className="odd:bg-lamaSkyLight even:bg-lamaPurpleLight rounded-md p-4 hover:bg-opacity-80 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-gray-700">{announcement.title}</h2>
              <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
                {new Date(announcement.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
            <p className="text-sm text-gray-500">{announcement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
