import { getServerSession } from "next-auth";
import prisma from "@/prisma/db";

import { authOptions } from "../api/auth/[...nextauth]/options";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TodoGrid from "./TodoGrid";

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
      <div className="absolute top-0 right-0 m-2">
        <Link
          href="/todos/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Todo
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
