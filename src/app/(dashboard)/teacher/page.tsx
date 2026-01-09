import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import { currentUser } from '@/lib/utils';

const TeacherPage = async () => {
  const { userId } = await currentUser();

  if (!userId) {
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row h-full">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full min-h-[calc(100vh-120px)] bg-white p-4 rounded-md flex flex-col">
          <h1 className="text-xl font-semibold mb-4">Schedule</h1>
          <div className="flex-1">
            <BigCalendarContainer type="teacherId" id={userId} />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
