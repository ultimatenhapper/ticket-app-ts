import options from "@/app/api/auth/[...nextauth]/options";
import { Project } from "@prisma/client";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const NewTicket = async (project: Project) => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  return <TicketForm project={project} />;
};

export default NewTicket;
