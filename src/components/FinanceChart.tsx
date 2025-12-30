'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expense: 1398,
  },
  {
    name: 'Mar',
    income: 5000,
    expense: 3800,
  },
  {
    name: 'Apr',
    income: 2780,
    expense: 3908,
  },
  {
    name: 'May',
    income: 4890,
    expense: 2800,
  },
  {
    name: 'Jun',
    income: 5390,
    expense: 3800,
  },
  {
    name: 'Jul',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Aug',
    income: 4200,
    expense: 3100,
  },
  {
    name: 'Sep',
    income: 4800,
    expense: 3600,
  },
  {
    name: 'Oct',
    income: 5200,
    expense: 4000,
  },
  {
    name: 'Nov',
    income: 4600,
    expense: 3200,
  },
  {
    name: 'Dec',
    income: 5800,
    expense: 4500,
  },
];

const FinanceChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-lg h-full w-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {mounted && (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: '#d1d5db' }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} tickMargin={10} />
            <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#C3EBFA"
              strokeWidth={5}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#CFCEFF"
              strokeWidth={5}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FinanceChart;
