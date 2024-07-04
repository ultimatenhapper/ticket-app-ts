import Link from "next/link";
import React from "react";
import ToggleMode from "./ToggleMode";
import MainNavLinks from "./MainNavLinks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const MainNav = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {/* <MainNavLinks role={session?.user.role} /> */}
      <div className="flex justify-end gap-2">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}
        {/* <ToggleMode /> */}
      </div>
    </div>
  );
};

export default MainNav;
