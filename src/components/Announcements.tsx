import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { currentUser } from '@/lib/utils';

const Announcements = async () => {
  const { role, userId } = await currentUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Início do dia

  // Construir query baseada na role
  const query: Prisma.AnnouncementWhereInput = {
    date: {
      gte: today, // Avisos de hoje para frente (atuais e futuros)
    },
  };

  if (role !== 'admin') {
    // Outras roles veem: announcements globais OU da sua classe
    const roleConditions: Record<string, Prisma.ClassWhereInput> = {
      teacher: { lessons: { some: { teacherId: userId! } } },
      student: { students: { some: { id: userId! } } },
      parent: { students: { some: { parentId: userId! } } },
    };

    if (role && roleConditions[role]) {
      query.OR = [
        { classId: null }, // Announcements globais
        { class: roleConditions[role] }, // Announcements da classe do usuário
      ];
    }
  }
  // Admin não tem filtro de role, vê todos os announcements

  const data = await prisma.announcement.findMany({
    where: query,
    orderBy: {
      date: 'asc', // Avisos mais próximos primeiro
    },
    take: 4,
  });

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        {data.map(announcement => (
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
