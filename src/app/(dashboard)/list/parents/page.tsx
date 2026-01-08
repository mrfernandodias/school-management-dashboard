import { Parent, Prisma, Student } from '@prisma/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@/lib/utils';

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { userId, role } = await currentUser();
  const columns = [
    { header: 'Info', accessor: 'info' },
    { header: 'Students', accessor: 'students', className: 'hidden md:table-cell' },
    { header: 'Phone', accessor: 'phone', className: 'hidden md:table-cell' },
    { header: 'Address', accessor: 'address', className: 'hidden md:table-cell' },
    ...(role === 'admin'
      ? [{ header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' }]
      : []),
  ];

  const renderRow = (parent: ParentList) => {
    return (
      <tr
        key={parent.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold ">{parent.name}</h3>
            <p className="text-xs text-gray-500">{parent.email}</p>
          </div>
        </td>

        <td className=" hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {parent.students.map(student => student.name).join(', ')}
          </div>
        </td>

        <td className=" hidden md:table-cell">{parent.phone}</td>
        <td className=" hidden md:table-cell">{parent.address}</td>
        <td className="">
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <>
                <FormModal table="parent" type="update" id={parent.id} />
                <FormModal table="parent" type="delete" id={parent.id} />
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
  const query: Prisma.ParentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = { contains: value as string, mode: 'insensitive' };
            break;
        }
      }
    }
  }

  // ⚠️ Validar se página é um número válido
  if (isNaN(p) || p < 1) {
    redirect('/list/parents');
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (p - 1) * ITEMS_PER_PAGE,
    }),
    prisma.parent.count({ where: query }),
  ]);

  // 🔒 Calcular total de páginas
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // 🚫 Redirecionar se página não existe
  if (p > totalPages && totalPages > 0) {
    redirect('/list/parents?page=' + totalPages);
  }
  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All parents</h1>
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
            {role === 'admin' && <FormModal table="parent" type="create" />}
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

export default ParentListPage;
