'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

// #region Sample data
const data = [
  { name: 'Group A', value: 92, fill: '#C3EBFA' },
  { name: 'Group B', value: 8, fill: '#FAE27C' },
];

const Performance = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-md p-4 h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              fill="#8884d8"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">9.2</h1>
        <p className="text-xs text-gray-300">of 10 max TS</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        1st Semester - 2nd Semester
      </h2>
    </div>
  );
};

export default Performance;
