import prisma from "@/prisma/db";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ProjectGrid } from "./ProjectGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

const Projects = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: true,
    },
  });

  const projects = user?.projects;

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 m-2">
        <Link
          href="/projects/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Project
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
