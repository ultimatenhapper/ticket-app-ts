"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  icon: React.ReactNode;
  path: string;
  title: string;
}
const SidebarItem = ({ icon, path, title }: Props) => {
  const pathName = usePathname();

  // console.log(path, pathName);
  return (
    <li>
      <Link
        href={path}
        className={`px-4 py-3 flex items-center space-x-4 rounded-md group 
          hover:bg-gradient-to-r hover:from-sky-600 hover:text-white ${
            path === pathName
              ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
              : ""
          }`}
      >
        {icon}
        <span className="group-hover:text-gray-700">{title}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
