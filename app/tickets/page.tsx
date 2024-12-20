"use server";

import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

import DataTable from "./DataTable";
import Pagination from "@/components/Pagination";
import ProjectFilter from "@/components/ProjectFilter";
import StatusFilter from "@/components/StatusFilter";
import { Status, Ticket } from "@prisma/client";
import TicketSearch from "@/components/TicketSearch";

export interface SearchParams {
  project: string;
  status: Status;
  search: string;
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
  const projectId = searchParams.project ? parseInt(searchParams.project) : 0;
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
      NOT: [{ status: "CLOSED" as Status }, { status: "ARCHIVED" as Status }],
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { projects: true },
  });

  // console.log({ projectId });
  const projectIds =
    projectId === 0 ? user?.projects.map((project) => project.id) : [projectId];
  // console.log({ projectIds });
  const validProjectIds = projectIds?.filter((id) => !isNaN(id)) || [0];
  // console.log({ validProjectIds });
  const ticketCount = await prisma.ticket.count({
    where: {
      AND: [
        { ...where },
        {
          projectId: {
            in: validProjectIds.length > 0 ? validProjectIds : null,
          },
        },
      ],
    },
  });

  // console.log({ ticketCount });
  const tickets = await prisma.ticket.findMany({
    where: {
      AND: [
        { ...where },
        {
          projectId: {
            in: validProjectIds?.length > 0 ? validProjectIds : null,
          },
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
        <TicketSearch />
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
