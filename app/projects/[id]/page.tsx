import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import ProjectDetail from "@/app/api/projects/[id]/ProjectDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AssignProject from "@/components/AssignProject";

interface Props {
  params: { id: string };
}

const ViewProject = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      users: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {
        where: { id: parseInt(params.id) },
        include: {
          tickets: true,
        },
      },
    },
  });

  const tickets = user?.projects.length ? user.projects[0].tickets : [];
  const users = await prisma.user.findMany();
  const assignedUsers = project?.users;

  if (!project) {
    return <p className="text-destructive">Project not found!</p>;
  }

  return (
    <>
      <ProjectDetail project={project} tickets={tickets} />
      <div className="flex items-center">
        <AssignProject
          project={project}
          users={users}
          assignedUsers={assignedUsers}
        />
      </div>
    </>
  );
};

export default ViewProject;
