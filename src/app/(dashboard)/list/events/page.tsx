import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import { role, eventsData } from '@/lib/data';
import Link from 'next/link';
import FormModal from '@/components/FormModal';

const columns = [
  { header: 'Event Name', accessor: 'name' },
  { header: 'Class', accessor: 'class', className: 'hidden md:table-cell' },
  { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
  { header: 'Start Time', accessor: 'startTime', className: 'hidden md:table-cell' },
  { header: 'End Time', accessor: 'endTime', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'actions', className: 'hidden md:table-cell' },
];

type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

const EventListPage = () => {
  const renderRow = (item: Event) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50 text-sm"
      >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td className=" hidden md:table-cell">{item.class}</td>
        <td className=" hidden md:table-cell">{item.date}</td>
        <td className=" hidden md:table-cell">{item.startTime}</td>
        <td className=" hidden md:table-cell">{item.endTime}</td>
        <td className="">
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <>
                <FormModal table="event" type="update" id={item.id} />
                <FormModal table="event" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
            {role === 'admin' && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={eventsData} />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default EventListPage;
