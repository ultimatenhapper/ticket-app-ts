import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/options";
import prisma from "@/prisma/db";

import DashChart from "@/components/DashChart";
import DashRecentTickets from "@/components/DashRecentTickets";
import TimeLogGraph from "@/components/TimeLogGraph";
import TimeLogPeriodGraph from "@/components/TimeLogPeriodGraph";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { projects: true },
  });

  if (!user || !user.projects) {
    return (
      <p className="flex items-center align-middle text-3xl">
        No projects found for{" "}
        <span className="to-blue-600">{session.user.name}</span>
      </p>
    );
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      ticket: true,
    },
  });

  const transformedTimeLogs = timeLogs.map((timeLog) => {
    return {
      ...timeLog,
      title: timeLog.ticket.title,
    };
  });

  const projectIds = user.projects.map((project) => project.id);

  const tickets = await prisma.ticket.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
      NOT: [{ status: "CLOSED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 10,
    include: {
      assignedToUser: true,
    },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      projectId: {
        in: projectIds,
      },
    },
  });

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2">
        <div>
          <DashRecentTickets tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
        <div>
          <TimeLogGraph timeLogs={transformedTimeLogs} />
        </div>
        <div>
          <TimeLogPeriodGraph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
