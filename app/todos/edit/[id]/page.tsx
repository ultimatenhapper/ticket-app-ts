import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

interface Props {
  params: { id: string };
}
const TodoForm = dynamic(() => import("@/components/TodoForm"), {
  ssr: false,
});

const EditTodo = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const todo = await prisma?.todo.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!todo) {
    return <p className="text-destructive">Todo not found</p>;
  }
  return <TodoForm todo={todo} />;
};

export default EditTodo;
