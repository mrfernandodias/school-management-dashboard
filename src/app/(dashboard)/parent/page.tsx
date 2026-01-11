import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';

const ParentPage = () => {
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-[800px] bg-white p-4 rounded-md flex flex-col">
          <h1 className="text-xl font-semibold mb-4">Schedule (John Doe)</h1>
          <div className="flex-1">
            <BigCalendarContainer type="classId" id={1} />
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

export default ParentPage;
