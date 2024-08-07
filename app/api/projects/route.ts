import { projectSchema } from "@/ValidationSchema/project";
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
  const validation = projectSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { name, description } = body;
  const newProject = await prisma.project.create({
    data: {
      name,
      description,
      users: {
        connect: { id: session.user.id },
      },
    },
  });

  return NextResponse.json(newProject, { status: 201 });
}
