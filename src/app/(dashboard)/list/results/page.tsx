import { Prisma } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const columns = [
  { header: 'Title', accessor: 'title' },
  { header: 'Student', accessor: 'student' },
  { header: 'Score', accessor: 'score', className: 'hidden md:table-cell' },
  { header: 'Teacher', accessor: 'teacher', className: 'hidden md:table-cell' },
  { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
  { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'actions' },
];

const renderRow = (item: ResultList) => {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.studentName + ' ' + item.studentSurname}</td>
      <td className=" hidden md:table-cell">{item.score}</td>
      <td className=" hidden md:table-cell">{item.teacherName + ' ' + item.teacherSurname}</td>
      <td className=" hidden md:table-cell">{item.className}</td>
      <td className=" hidden md:table-cell">
        {new Intl.DateTimeFormat('en-US').format(item.startTime)}
      </td>
      <td className="">
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormModal table="result" type="update" id={item.id} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(Array.isArray(page) ? page[0] : page) : 1;

  // URL Params Conditions
  const query: Prisma.ResultWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value as string;
            break;
          case 'search':
            query.OR = [
              { exam: { title: { contains: value as string, mode: 'insensitive' } } },
              { student: { name: { contains: value as string, mode: 'insensitive' } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ⚠️ Validar se página é um número válido
  if (isNaN(p) || p < 1) {
    redirect('/list/results');
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map(item => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = 'startTime' in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student?.name,
      studentSurname: item.student?.surname,
      teacherName: assessment.lesson?.teacher?.name,
      teacherSurname: assessment.lesson?.teacher?.surname,
      score: item.score,
      className: assessment.lesson?.class?.name,
      startTime: isExam ? (assessment as any).startTime : (assessment as any).startDate,
    };
  });

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/results?page=' + totalPages);
  }
  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
            {role === 'admin' && <FormModal table="result" type="create" />}
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

export default ResultListPage;
