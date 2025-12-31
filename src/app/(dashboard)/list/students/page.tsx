import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import { role, studentsData } from '@/lib/data';
import Link from 'next/link';
import FormModal from '@/components/FormModal';

const columns = [
  { header: 'Info', accessor: 'info' },
  { header: 'Student ID', accessor: 'studentId', className: 'hidden md:table-cell' },
  { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
  { header: 'Phone', accessor: 'phone', className: 'hidden md:table-cell' },
  { header: 'Address', accessor: 'address', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' },
];

type Student = {
  id: number;
  name: string;
  photo: string;
  email?: string;
  studentId: string;
  class: string;
  phone: string;
  address: string;
};

const StudentListPage = () => {
  const renderRow = (student: Student) => {
    return (
      <tr
        key={student.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={student.photo}
            alt={student.name}
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold ">{student.name}</h3>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </td>
        <td className=" hidden md:table-cell">{student.studentId}</td>

        <td className=" hidden md:table-cell">{student.class}</td>
        <td className=" hidden md:table-cell">{student.phone}</td>
        <td className=" hidden md:table-cell">{student.address}</td>
        <td className="">
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <Link href={`/list/students/${student.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                  <Image
                    src="/view.png"
                    alt="View"
                    width={16}
                    height={16}
                    draggable={false}
                    className="select-none"
                  />
                </button>
              </Link>
            )}
            {role === 'admin' && <FormModal table="student" type="delete" id={student.id} />}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:scale-105 transition-transform">
              <Image
                src="/filter.png"
                alt=""
                width={14}
                height={14}
                draggable={false}
                className="select-none"
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:scale-105 transition-transform">
              <Image
                src="/sort.png"
                alt=""
                width={14}
                height={14}
                draggable={false}
                className="select-none"
              />
            </button>
            {role === 'admin' && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={studentsData} />
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default StudentListPage;
