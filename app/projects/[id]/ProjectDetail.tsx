"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, Ticket } from "@prisma/client";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { setCookie } from "cookies-next";

import { amountToTime } from "@/helpers/helpers";
import DeleteButton from "./DeleteButton";

interface Props {
  project: Project;
  tickets?: Ticket[];
}

const ProjectDetail = ({ project, tickets }: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tts, setTts] = useState("");
  const { data: session } = useSession();

  const calculateProgress = () => {
    if (!tickets) return 0;
    const closedTickets = tickets?.filter(
      (ticket) => ticket.status === "CLOSED"
    );
    return tickets.length > 0
      ? (closedTickets.length / tickets.length) * 100
      : 0;
  };

  const calculateTts = () => {
    const totalTime = tickets?.reduce(
      (acc: number, ticket: Ticket) => acc + Number(ticket.TTS),
      0
    );

    return amountToTime(totalTime);
  };

  useEffect(() => {
    if (session?.user?.roles === "ADMIN") setIsAdmin(true);
    setCookie("currentProject", project.id);
    setProgress(Math.ceil(calculateProgress()));
    setTts(calculateTts());
  }, [session, project.id]);

  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            Created:{" "}
            {project.createdAt.toLocaleDateString("en-ES", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            <br />
            Updated:{" "}
            {project.updatedAt.toLocaleDateString("en-ES", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <Markdown>{project.description}</Markdown>
          <div className="flex flex-row gap-5 text-3xl items-center">
            <Progress value={progress} />
            <span>{progress}%</span>
          </div>
        </CardContent>
        <CardFooter className="text-2xl">
          Total Time Spent <span className="font-bold ml-4">{tts}</span>
        </CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        {/* <AssignProject project={project} users={users} /> */}
        <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "secondary" })}
        >
          New Ticket
        </Link>
        <Link
          href={`/projects/edit/${project.id}`}
          className={`${buttonVariants({
            variant: "default",
          })}`}
        >
          Edit Project
        </Link>
        {isAdmin && <DeleteButton projectId={project.id} />}
      </div>
    </div>
  );
};

export default ProjectDetail;
