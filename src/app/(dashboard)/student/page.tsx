import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import EventCalendar from '@/components/EventCalendar';
import prisma from '@/lib/prisma';
import { currentUserId } from '@/lib/utils';

const StudentPage = async () => {
  const userId = await currentUserId();

  // findFirst porque estamos buscando por relação, não por campo único
  const classItem = await prisma.class.findFirst({
    where: {
      students: { some: { id: userId! } },
    },
  });

  if (!classItem) {
    return <div>Turma não encontrada para este estudante</div>;
  }

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row h-full">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full min-h-[calc(100vh-120px)] bg-white p-4 rounded-md flex flex-col">
          <h1 className="text-xl font-semibold mb-4">Schedule ({classItem.name})</h1>
          <div className="flex-1">
            <BigCalendarContainer type="classId" id={classItem.id} />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
