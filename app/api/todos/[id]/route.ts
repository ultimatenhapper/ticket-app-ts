import { todoSchema } from "@/ValidationSchema/todo";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const body = await request.json();
  const validation = todoSchema.safeParse(body);

  if (!validation.success) {
    console.log(validation.error.format());
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!todo) {
    return NextResponse.json({ error: "Todo Not Found" }, { status: 404 });
  }

  //   if (body?.assignedToUserId) {
  //     body.assignedToUserId = parseInt(body.assignedToUserId);
  //   }
  const updatedTodo = await prisma.todo.update({
    where: { id: todo.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updatedTodo);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!todo) {
    return NextResponse.json({ error: "Todo Not Found" }, { status: 404 });
  }

  await prisma.todo.delete({
    where: { id: todo.id },
  });

  return NextResponse.json({ message: "Todo deleted" }, { status: 201 });
}
