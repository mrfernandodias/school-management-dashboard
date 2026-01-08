import { Class, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { defaultSubjectColor, subjectColors } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { currentUserRole } from '@/lib/utils';

type TeacherList = Teacher & {
  subjects: Subject[];
  classes: Class[];
};

// 🎨 Renderiza badges de matérias com cores

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const role = await currentUserRole();

  const columns = [
    { header: 'Info', accessor: 'info' },
    { header: 'Teacher ID', accessor: 'teacherId', className: 'hidden md:table-cell' },
    { header: 'Subjects', accessor: 'subjects', className: 'hidden md:table-cell' },
    { header: 'Classes', accessor: 'classes', className: 'hidden md:table-cell' },
    { header: 'Phone', accessor: 'phone', className: 'hidden md:table-cell' },
    { header: 'Address', accessor: 'address', className: 'hidden md:table-cell' },
    ...(role === 'admin'
      ? [{ header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' }]
      : []),
  ];

  const renderSubjectBadges = (subjects: Subject[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {subjects.map(subject => {
          const colors = subjectColors[subject.name] || defaultSubjectColor;
          return (
            <span
              key={subject.id}
              className={`${colors.bg} ${colors.text} px-2 py-1 rounded-md text-xs font-medium`}
            >
              {subject.name}
            </span>
          );
        })}
      </div>
    );
  };

  const renderRow = (teacher: TeacherList) => {
    return (
      <tr
        key={teacher.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={teacher.img || '/noAvatar.png'}
            alt={teacher.name}
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold ">{teacher.name}</h3>
            <p className="text-xs text-gray-500">{teacher.email}</p>
          </div>
        </td>
        <td className=" hidden md:table-cell">{teacher.username}</td>
        <td className=" hidden md:table-cell">{renderSubjectBadges(teacher.subjects)}</td>
        <td className=" hidden md:table-cell">
          {teacher.classes.map(c => c.name).join(', ') || 'N/A'}
        </td>
        <td className=" hidden md:table-cell">{teacher.phone}</td>
        <td className=" hidden md:table-cell">{teacher.address}</td>
        <td className="">
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${teacher.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image
                  src="/view.png"
                  alt="View"
                  width={14}
                  height={14}
                  draggable={false}
                  className="select-none"
                />
              </button>
            </Link>
            {role === 'admin' && <FormModal table="teacher" type="delete" id={teacher.id} />}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(Array.isArray(page) ? page[0] : page) : 1;

  // URL Params Conditions
  const query: Prisma.TeacherWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lessons = {
              some: {
                classId: parseInt(value as string),
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
    redirect('/list/teachers');
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.teacher.count({ where: query }),
  ]);

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/teachers?page=' + totalPages);
  }

  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
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
            {role === 'admin' && <FormModal table="teacher" type="create" />}
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

export default TeacherListPage;
