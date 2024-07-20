import React from "react";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import TicketDetail from "./TicketDetail";

interface Props {
  params: { id: string };
}
const ViewTicket = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  const users = await prisma.user.findMany();

  if (!ticket) {
    return <p className="text-destructive">Ticket not found!</p>;
  }
  return <TicketDetail ticket={ticket} users={users} />;
};

export default ViewTicket;
