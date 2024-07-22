import { getServerSession } from "next-auth";
import prisma from "@/prisma/db";

import { authOptions } from "../api/auth/[...nextauth]/options";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TodoGrid from "./TodoGrid";
import { IoAddCircle } from "react-icons/io5";

const Todos = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      todos: true,
    },
  });

  const todos = user?.todos;

  return (
    <div className="relative">
      <div className="fixed top-10 right-10">
        <Link href="/todos/new" className="flex items-center p-2 rounded-full">
          <IoAddCircle size={90} />
        </Link>
      </div>
      <div className="flex items-center justify-center mt-8">
        {todos && todos.length > 0 ? (
          <TodoGrid todos={todos} />
        ) : (
          <p className="text-3xl items-center align-middle">
            No todos assigned to {session.user.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default Todos;
