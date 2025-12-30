import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lama Dev School Management Dashboard',
  description: 'Next.js School Management System',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            draggable={false}
            className="select-none"
          />
          <span className="hidden lg:block font-bold">FDS School</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#f7f8fa] overflow-y-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
