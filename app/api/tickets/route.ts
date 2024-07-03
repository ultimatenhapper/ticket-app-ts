import { ticketSchema } from "@/ValidationSchema/ticket";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const body = await request.json();
  const validation = ticketSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { title, description, status, priority, projectId, assignedToUserId } =
    body;

  const ticketStatus = status || "OPEN";
  const ticketPriority = priority || "LOW";

  const newTicket = await prisma.ticket.create({
    data: {
      title,
      description,
      status: ticketStatus,
      priority: ticketPriority,
      assignedToUserId,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  return NextResponse.json(newTicket, { status: 201 });
}
