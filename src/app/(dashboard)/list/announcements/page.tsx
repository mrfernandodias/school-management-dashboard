import { Announcement, Class, Prisma } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@/lib/utils';
import prisma from '../../../../lib/prisma';

type AnnouncementList = Announcement & { class: Class };

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { role, userId } = await currentUser();

  const columns = [
    { header: 'Announcement Title', accessor: 'title' },
    { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
    { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
    ...(role === 'admin'
      ? [{ header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' }]
      : []),
  ];

  const renderRow = (item: AnnouncementList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td className=" hidden md:table-cell">{item.class?.name || 'All'}</td>
        <td className=" hidden md:table-cell">
          {new Intl.DateTimeFormat('pt-BR').format(item.date)}
        </td>
        <td className="">
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <>
                <FormModal table="announcement" type="update" id={item.id} />
                <FormModal table="announcement" type="delete" id={item.id} />
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
  const query: Prisma.AnnouncementWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value as string, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  // Role conditions - filtra eventos baseado na role do usuário
  // Admin vê todos, outras roles veem eventos globais + eventos das suas turmas
  if (role !== 'admin') {
    const roleConditions: Record<string, Prisma.ClassWhereInput> = {
      teacher: { lessons: { some: { teacherId: userId! } } },
      student: { students: { some: { id: userId! } } },
      parent: { students: { some: { parentId: userId! } } },
    };

    if (role && roleConditions[role]) {
      query.OR = [
        { classId: null }, // Eventos globais
        { class: roleConditions[role] }, // Eventos das turmas do usuário
      ];
    }
  }

  // ⚠️ Validar se página é um número válido
  if (isNaN(p) || p < 1) {
    redirect('/list/announcements');
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.announcement.count({ where: query }),
  ]);

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/announcements?page=' + totalPages);
  }

  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
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
            {role === 'admin' && <FormModal table="announcement" type="create" />}
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

export default AnnouncementListPage;
