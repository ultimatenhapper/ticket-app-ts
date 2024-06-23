import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

const ProjectForm = dynamic(() => import("@/components/ProjectForm"), {
  ssr: false,
});

const NewTicket = async () => {
  const session = await getServerSession(options);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }
  return <ProjectForm />;
};

export default NewTicket;
