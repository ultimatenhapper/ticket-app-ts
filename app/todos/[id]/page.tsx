// app/todos/[id]/pomodoro/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";
import Pomodoro from "@/components/Pomodoro";

interface PageProps {
  params: { id: string };
}

export default async function PomodoroPage({ params }: PageProps) {
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(params.id) },
    include: { ticket: true },
  });

  if (!todo) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pomodoro: {todo.name}</h1>
      <Pomodoro todo={todo} ticket={todo.ticket} />
    </div>
  );
}
