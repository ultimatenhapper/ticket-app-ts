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

  const { ticketId, startTime, endTime, duration } = body;

  const newTimeLog = await prisma.timeLog.create({
    data: {
      startTime,
      endTime,
      duration,
      ticket: {
        connect: {
          id: ticketId,
        },
      },
    },
  });

  return NextResponse.json(newTimeLog, { status: 201 });
}
