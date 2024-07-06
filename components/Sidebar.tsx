import Image from "next/image";
import Link from "next/link";
import SidebarItem from "./SidebarItem";
import {
  IoBasketOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoCodeWorkingOutline,
  IoListOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const menuItems = [
  {
    icon: <IoCalendarOutline />,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <IoCheckboxOutline />,
    title: "Projects",
    path: "/projects",
  },
  {
    icon: <IoListOutline />,
    title: "Tickets",
    path: "/tickets",
  },
  {
    icon: <IoPersonOutline />,
    title: "Users",
    path: "/users",
  },
];
const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  console.log({ session });
  const avatarUrl =
    session?.user?.image ||
    "https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp";
  const userName = session?.user?.name ?? "No name";
  const userRoles = session?.user?.roles ?? ["USER"];

  return (
    <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="-mx-6 px-6 py-4">
          <Link href="/dashboard" title="home">
            <Image
              src="ticketer.svg"
              className="w-96"
              alt="ticketer logo"
              width={300}
              height={300}
              priority={false}
            />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Image
            // src="https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp"
            src={avatarUrl}
            alt=""
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
            width={150}
            height={150}
          />
          <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
            {userName}
          </h5>
          <span className="hidden text-gray-400 lg:block">
            {/* {userRoles.join(",")} */}
          </span>
        </div>
        <ul className="space-y-2 tracking-wide mt-8">
          {menuItems.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </ul>
      </div>

      {/* <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
        <LogoutButton />
      </div> */}
    </aside>
  );
};

export default Sidebar;
