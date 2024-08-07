import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  // console.log("PATCH", { session });
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const timelog = await prisma.timeLog.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!timelog) {
    return NextResponse.json({ error: "Timelog Not Found" }, { status: 404 });
  }
  const updatedTimelog = await prisma.timeLog.update({
    where: { id: timelog.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updatedTimelog);
}
