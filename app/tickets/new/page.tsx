import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { Project } from "@prisma/client";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const NewTicket = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-destructive">Login required</p>;
  }

  const cookieStore = cookies();
  const projectId = cookieStore.get("currentProject")?.value;

  return <TicketForm projectId={Number(projectId)} />;
};

export default NewTicket;
