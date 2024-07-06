import prisma from "@/prisma/db";
import DataTable from "./DataTable";
import Pagination from "@/components/Pagination";
import StatusFilter from "@/components/StatusFilter";
import { Status, Ticket } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import ProjectFilter from "@/components/ProjectFilter";

export interface SearchParams {
  project: string;
  status: Status;
  page: string;
  orderBy: keyof Ticket;
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1;

  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";
  const projectId =
    searchParams.project !== "0" ? parseInt(searchParams.project) : 0;
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  console.log({ projectId });

  let where = {};

  if (status) {
    where = {
      status,
    };
  } else {
    where = {
      NOT: [{ status: "CLOSED" as Status }],
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { projects: true },
  });

  const ticketCount = await prisma.ticket.count({ where });
  const projectIds =
    projectId === 0 ? user?.projects.map((project) => project.id) : [projectId];
  const validProjectIds = projectIds?.filter((id) => !isNaN(id)) || [0];
  const tickets = await prisma.ticket.findMany({
    where: {
      AND: [
        { ...where },
        {
          projectId: {
            in: validProjectIds?.length > 0 ? validProjectIds : undefined,
          },
        },
      ],
    },
    include: {
      project: true,
      assignedToUser: true,
    },
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex gap-2">
        {/* <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Ticket
        </Link> */}
        <ProjectFilter projects={user?.projects} />
        <StatusFilter />
      </div>
      <DataTable tickets={tickets} searchParams={searchParams} />
      <Pagination
        itemCount={ticketCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Tickets;
