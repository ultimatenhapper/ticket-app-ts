import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProjectFilter from "@/components/ProjectFilter";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

const TodoForm = dynamic(() => import("@/components/TodoForm"), {
  ssr: false,
});

const NewTodo = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {},
    },
  });

  const projects = user?.projects || [];

  return (
    <>
      <TodoForm projects={projects} />
    </>
  );
};

export default NewTodo;
