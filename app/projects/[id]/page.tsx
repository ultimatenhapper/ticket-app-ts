import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import ProjectDetail from "@/app/projects/[id]/ProjectDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AssignProject from "@/components/AssignProject";
import DataTable from "@/app/tickets/DataTable";
import Pagination from "@/components/Pagination";
import { Status, Ticket } from "@prisma/client";
import StatusFilter from "@/components/StatusFilter";
import TicketSearch from "@/components/TicketSearch";

import { Prisma } from "@prisma/client";

interface Props {
  params: { id: string };
  searchParams: {
    status: Status;
    search: string;
    page: string;
    orderBy: keyof Ticket;
  };
}

const ViewProject = async ({ params, searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1;

  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";
  // const projectId = searchParams.project ? parseInt(searchParams.project) : 0;
  const projectId = params.id ? parseInt(params.id) : 0;
  const search = searchParams.search ? searchParams.search : "";
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

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

  const project = await prisma.project.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      users: true,
      tickets: true,
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

  const ticketCount = await prisma.ticket.count({
    where: {
      AND: [
        { ...where },
        {
          projectId: parseInt(params.id),
        },
      ],
    },
  });

  const tickets = await prisma.ticket.findMany({
    where: {
      AND: [
        { ...where },
        {
          projectId: parseInt(params.id),
        },
        {
          title: {
            contains: search,
            mode: "insensitive",
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

  const users = await prisma.user.findMany();
  const assignedUsers = project?.users;
  const allTickets = project?.tickets;

  if (!project) {
    return <p className="text-destructive">Project not found!</p>;
  }

  return (
    <>
      <div className="m-10">
        <div className="flex flex-row">
          <StatusFilter />
          <TicketSearch />
        </div>
        <DataTable
          tickets={tickets}
          searchParams={{ ...searchParams, project: params.id }}
        />
        <Pagination
          itemCount={ticketCount}
          pageSize={pageSize}
          currentPage={page}
        />
      </div>
      <ProjectDetail project={project} tickets={allTickets} />
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
