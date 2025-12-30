'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Mon',
    present: 60,
    absent: 40,
  },
  {
    name: 'Tue',
    present: 70,
    absent: 60,
  },
  {
    name: 'Wed',
    present: 90,
    absent: 75,
  },
  {
    name: 'Thu',
    present: 90,
    absent: 75,
  },
  {
    name: 'Fri',
    present: 65,
    absent: 55,
  },
];

const AttendanceChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-lg h-full w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {mounted && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
            />
            <Bar dataKey="present" fill="#C3EBFA" legendType="circle" radius={[10, 10, 0, 0]} />
            <Bar dataKey="absent" fill="#FAE27C" legendType="circle" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AttendanceChart;
