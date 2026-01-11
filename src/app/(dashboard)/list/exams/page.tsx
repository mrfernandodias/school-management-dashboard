import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@/lib/utils';

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { role, userId } = await currentUser();
  const columns = [
    { header: 'Subject Name', accessor: 'name' },
    { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
    { header: 'Teacher', accessor: 'teacher', className: 'hidden md:table-cell' },
    { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
    ...(role === 'admin' || role === 'teacher'
      ? [{ header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' }]
      : []),
  ];

  const renderRow = (item: ExamList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
        <td className=" hidden md:table-cell">{item.lesson.class.name}</td>
        <td className=" hidden md:table-cell">
          {item.lesson.teacher.name + ' ' + item.lesson.teacher.surname}
        </td>
        <td className=" hidden md:table-cell">
          {new Intl.DateTimeFormat('en-US').format(item.startTime)}
        </td>
        <td className="">
          <div className="flex items-center gap-2">
            {(role === 'admin' || role === 'teacher') && (
              <>
                <FormContainer table="exam" type="update" id={item.id} data={item} />
                <FormContainer table="exam" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(Array.isArray(page) ? page[0] : page) : 1;

  // URL Params Conditions
  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson!.classId = parseInt(value as string);
            break;
          case 'teacherId':
            query.lesson.teacherId = value as string;
            break;
          case 'search':
            query.lesson!.subject = {
              name: { contains: value as string, mode: 'insensitive' },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // Role conditions
  switch (role) {
    case 'teacher':
      query.lesson!.teacherId = userId;
      break;
    case 'student':
      query.lesson.class = {
        students: { some: { id: userId! } },
      };
      break;
    case 'parent':
      query.lesson = {
        class: { students: { some: { parentId: userId! } } },
      };
      break;
    default:
      break;
  }

  // ⚠️ Validar se página é um número válido
  if (isNaN(p) || p < 1) {
    redirect('/list/exams');
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.exam.count({ where: query }),
  ]);

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/exams?page=' + totalPages);
  }

  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
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
            {role === 'admin' ||
              (role === 'teacher' && <FormContainer table="exam" type="create" />)}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamListPage;
