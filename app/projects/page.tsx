import prisma from "@/prisma/db";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ProjectGrid } from "./ProjectGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { IoAddCircle } from "react-icons/io5";

const Projects = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {
        orderBy: {
          isFavorite: "desc",
        },
      },
    },
  });

  const projects = user?.projects;

  return (
    <div className="relative">
      <div className="fixed top-10 right-10">
        <Link
          href="/projects/new"
          className="flex items-center p-2 rounded-full"
        >
          <IoAddCircle size={90} />
        </Link>
      </div>
      <div className="flex items-center justify-center mt-8">
        {projects && projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <p className="text-3xl items-center align-middle">
            No projects assigned to {session.user.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default Projects;
