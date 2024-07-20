import { todoSchema } from "@/ValidationSchema/todo";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
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

  const { name, description, status } = body;

  const todoStatus = status || "PENDING";

  const newtodo = await prisma.todo.create({
    data: {
      name,
      description,
      status: todoStatus,
      users: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(newtodo, { status: 201 });
}
