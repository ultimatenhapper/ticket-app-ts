import prisma from "@/prisma/db";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ProjectGrid } from "./ProjectGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { IoAddCircle } from "react-icons/io5";
import ProjectStatusFilter from "@/components/ProjectStatusFilter";
import { ProjectStatus } from "@prisma/client";
import ProjectSearch from "@/components/ProjectSearch";

export interface SearchParams {
  search: string;
  status: ProjectStatus;
}

const Projects = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const statuses = Object.values(ProjectStatus);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const search = searchParams.search ? searchParams.search : "";

  let where = {};

  if (status) {
    where = {
      status,
    };
  } else {
    where = {
      NOT: [{ status: "ARCHIVED" as ProjectStatus }],
    };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {
        where: {
          AND: [
            { ...where },
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
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
      <div className="flex flex-row gap-2">
        <ProjectStatusFilter />
        <ProjectSearch />
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
