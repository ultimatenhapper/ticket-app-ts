import UserForm from "@/components/UserForm";
import React from "react";
import DataTableSimple from "./data-table-simple";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Users = async () => {
  const session = await getServerSession(authOptions);

  console.log("users", { session });
  if (session?.user.roles !== "ADMIN") {
    return <p className="text-destructive">Admin access required</p>;
  }

  const users = await prisma.user.findMany();
  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};

export default Users;
