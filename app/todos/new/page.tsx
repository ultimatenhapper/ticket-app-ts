import { authOptions } from "@/app/api/auth/[...nextauth]/options";
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

  return <TodoForm />;
};

export default NewTodo;
