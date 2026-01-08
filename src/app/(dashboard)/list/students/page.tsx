import { Class, Prisma, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { currentUserRole } from '@/lib/utils';

type StudentList = Student & { class: Class };

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const role = await currentUserRole();

  const columns = [
    { header: 'Info', accessor: 'info' },
    { header: 'Student ID', accessor: 'studentId', className: 'hidden md:table-cell' },
    { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
    { header: 'Phone', accessor: 'phone', className: 'hidden md:table-cell' },
    { header: 'Address', accessor: 'address', className: 'hidden md:table-cell' },
    ...(role === 'admin'
      ? [{ header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' }]
      : []),
  ];

  const renderRow = (student: StudentList) => {
    return (
      <tr
        key={student.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={student.img || '/noAvatar.png'}
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
        <td className=" hidden md:table-cell">{student.username}</td>

        <td className=" hidden md:table-cell">{student.class.name}</td>
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

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(Array.isArray(page) ? page[0] : page) : 1;

  // URL Params Conditions
  const query: Prisma.StudentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.class = {
              lessons: {
                some: {
                  teacherId: value as string,
                },
              },
            };
            break;
          case 'search':
            query.name = { contains: value as string, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  // ⚠️ Validar se página é um número válido
  if (isNaN(p) || p < 1) {
    redirect('/list/students');
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.student.count({ where: query }),
  ]);

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/students?page=' + totalPages);
  }

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
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
