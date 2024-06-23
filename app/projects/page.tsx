import prisma from "@/prisma/db";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ProjectGrid } from "./ProjectGrid";
import { getServerSession } from "next-auth";
import options from "../api/auth/[...nextauth]/options";

const Projects = async () => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const projects = await prisma.project.findMany();

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
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
};

export default Projects;
