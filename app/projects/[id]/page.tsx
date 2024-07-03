import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import ProjectDetail from "@/app/api/projects/[id]/ProjectDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
  });

  const users = await prisma.user.findMany();

  if (!project) {
    return <p className="text-destructive">Project not found!</p>;
  }

  return (
    <>
      <ProjectDetail project={project} />
      <div className="flex items-center">
        <AssignProject project={project} users={users} />
      </div>
    </>
  );
};

export default ViewProject;
