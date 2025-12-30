import Image from 'next/image';

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 transition-all hover:ring-gray-400 focus-within:ring-2 focus-within:ring-lamaPurple">
      <Image
        src="/search.png"
        alt=""
        width={14}
        height={14}
        className="select-none"
        draggable={false}
      />
      <input
        type="text"
        placeholder="Search"
        className="outline-none w-[200px] bg-transparent p-2"
      />
    </div>
  );
};

export default TableSearch;
