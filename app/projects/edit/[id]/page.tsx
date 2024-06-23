import options from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

interface Props {
  params: { id: string };
}
const ProjectForm = dynamic(() => import("@/components/ProjectForm"), {
  ssr: false,
});

const EditProject = async ({ params }: Props) => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!project) {
    return <p className="text-destructive">Project not found</p>;
  }
  return <ProjectForm project={project} />;
};

export default EditProject;
