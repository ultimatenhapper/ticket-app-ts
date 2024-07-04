import { projectSchema } from "@/ValidationSchema/project";
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
  const validation = projectSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!project) {
    return NextResponse.json({ error: "Project Not Found" }, { status: 404 });
  }

  if (body?.assignedToUserId) {
    body.assignedToUserId = parseInt(body.assignedToUserId);
  }
  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!project) {
    return NextResponse.json({ error: "Project Not Found" }, { status: 404 });
  }

  await prisma.project.delete({
    where: { id: project.id },
  });

  return NextResponse.json({ message: "Project deleted" }, { status: 201 });
}
