import React from "react";
import prisma from "@/prisma/db";
import ProjectDetail from "@/app/api/projects/[id]/ProjectDetail";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}
const ViewProject = async ({ params }: Props) => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  const users = await prisma.user.findMany();

  if (!project) {
    return <p className="text-destructive">Project not found!</p>;
  }
  return <ProjectDetail project={project} users={users} />;
};

export default ViewProject;
