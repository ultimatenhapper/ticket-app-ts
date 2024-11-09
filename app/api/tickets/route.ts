import { ticketSchema } from "@/ValidationSchema/ticket";
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
  const validation = ticketSchema.safeParse(body);

  if (!validation.success) {
    console.log(validation.error.format());
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const {
    title,
    description,
    status,
    priority,
    dueDate,
    projectId,
    assignedToUserId,
  } = body;

  const ticket = await prisma.ticket.findFirst({
    where: {
      title: {
        equals: title,
        mode: "insensitive", // Case-insensitive search
      },
    },
  });

  if (ticket) {
    return NextResponse.json(
      { error: "A ticket with this title already exists" },
      { status: 400 }
    );
  }

  const ticketStatus = status || "OPEN";
  const ticketPriority = priority || "LOW";

  const newTicket = await prisma.ticket.create({
    data: {
      title,
      description,
      status: ticketStatus,
      priority: ticketPriority,
      assignedToUserId,
      dueDate,
      project: {
        connect: {
          id: projectId,
        },
      },
      assignedToUser: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(newTicket, { status: 201 });
}
