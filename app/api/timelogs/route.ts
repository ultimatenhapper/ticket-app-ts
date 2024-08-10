import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

interface Props {
  params: { start?: string; end?: string };
}

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
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (start && end) {
    // Fetch time logs within a specified period
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    const timeLogs = await prisma.timeLog.findMany({
      where: {
        startTime: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        ticket: true,
      },
    });

    return NextResponse.json(timeLogs, { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }
}
