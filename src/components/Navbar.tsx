import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role || '';

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 transition-all hover:ring-gray-400">
        <Image
          src="/search.png"
          alt="Search"
          width={14}
          height={14}
          draggable={false}
          className="select-none"
        />
        <input
          type="text"
          name="search"
          id="search"
          className="w-[200px] p-2 bg-transparent outline-none"
          placeholder="Search..."
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
          <Image
            src="/message.png"
            alt="Messages"
            width={20}
            height={20}
            draggable={false}
            className="select-none"
          />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition-colors">
          <Image
            src="/announcement.png"
            alt="Announcements"
            width={20}
            height={20}
            draggable={false}
            className="select-none"
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Fernando Dias</span>
          <span className="text-[10px] text-gray-500 text-right capitalize">{role as string}</span>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
