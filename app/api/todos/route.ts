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
  console.log({ body });

  if (body?.projectId) {
    body.projectId = body.projectId.toString();
    body.ticketId = body.ticketId.toString();
  }

  const validation = todoSchema.safeParse(body);

  if (!validation.success) {
    console.log(validation.error.format());
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  if (body?.projectId) {
    body.projectId = parseInt(body.projectId);
    body.ticketId = parseInt(body.ticketId);
  }

  const {
    name,
    description,
    status,
    steps,
    timeDuration,
    timeResting,
    projectId,
    ticketId,
  } = body;

  const todoStatus = status || "PENDING";

  const newtodo = await prisma.todo.create({
    data: {
      name,
      description,
      status: todoStatus,
      steps,
      timeDuration,
      timeResting,
      projectId,
      ticket: {
        connect: {
          id: ticketId,
        },
      },
      users: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(newtodo, { status: 201 });
}
