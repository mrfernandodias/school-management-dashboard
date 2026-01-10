import Image from 'next/image';
import Link from 'next/link';
import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalendar';
import FormContainer from '@/components/FormContainer';
import Performance from '@/components/Performance';

const SingleTeacherPage = async () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Teacher"
                width={144}
                height={144}
                draggable={false}
                className="w-36 h-36 rounded-full object-cover select-none"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold">Leonard Snyder</h1>
                <FormContainer
                  table="teacher"
                  type="update"
                  data={{
                    id: 1,
                    username: 'john-doe',
                    email: 'john@doe.com',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1 234 567 89',
                    address: '123 Main St, Anytown, USA',
                    bloodType: 'A+',
                    birthday: '1990-01-01',
                    gender: 'male',
                    img: 'https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200',
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/blood.png"
                    alt="Blood Type"
                    width={14}
                    height={14}
                    draggable={false}
                    className="select-none"
                  />
                  <span>A+</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/date.png"
                    alt="Date"
                    width={14}
                    height={14}
                    draggable={false}
                    className="select-none"
                  />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/mail.png"
                    alt="Email"
                    width={14}
                    height={14}
                    draggable={false}
                    className="select-none"
                  />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/phone.png"
                    alt="Phone"
                    width={14}
                    height={14}
                    draggable={false}
                    className="select-none"
                  />
                  <span>+1 234 567</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] hover:shadow-md transition-shadow">
              <Image
                src="/singleAttendance.png"
                alt="Attendance"
                width={24}
                height={24}
                draggable={false}
                className="w-6 h-6 select-none"
              />
              <div>
                <h1 className="text-lg font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] hover:shadow-md transition-shadow">
              <Image
                src="/singleBranch.png"
                alt="Branches"
                width={24}
                height={24}
                draggable={false}
                className="w-6 h-6 select-none"
              />
              <div>
                <h1 className="text-lg font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] hover:shadow-md transition-shadow">
              <Image
                src="/singleLesson.png"
                alt="Lessons"
                width={24}
                height={24}
                draggable={false}
                className="w-6 h-6 select-none"
              />
              <div>
                <h1 className="text-lg font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] hover:shadow-md transition-shadow">
              <Image
                src="/singleClass.png"
                alt="Classes"
                width={24}
                height={24}
                draggable={false}
                className="w-6 h-6 select-none"
              />
              <div>
                <h1 className="text-lg font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 h-[800px] bg-white p-4 rounded-md flex flex-col">
          <h1 className="text-xl font-semibold mb-4">Teacher&apos;s Schedule</h1>
          <div className="flex-1">
            <BigCalendar data={[]} />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/classes?supervidorId=${'teacher2'}`}
            >
              Teacher's Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/students?teacherId=${'teacher2'}`}
            >
              Teacher's Students
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/lessons?teacherId=${'teacher2'}`}
            >
              Teacher's Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${'teacher2'}`}
            >
              Teacher's Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-green-50"
              href={`/list/assignments?teacherId=${'teacher2'}`}
            >
              Teacher's Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
