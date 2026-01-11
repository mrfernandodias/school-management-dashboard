import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import { currentUserId } from '@/lib/utils';
import prisma from '@/lib/prisma';

const ParentPage = async () => {
  const userId = await currentUserId();

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      {students.map(student => (
        <div className="w-full xl:w-2/3" key={student.id}>
          <div className="h-[800px] bg-white p-4 rounded-md flex flex-col">
            <h1 className="text-xl font-semibold mb-4">
              Schedule {student.name + ' ' + student.surname}
            </h1>
            <div className="flex-1">
              {student.classId ? (
                <BigCalendarContainer type="classId" id={student.classId} />
              ) : (
                <p className="text-gray-500">No class assigned</p>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
