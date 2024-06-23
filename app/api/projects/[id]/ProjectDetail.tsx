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
import { Project, User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import DeleteButton from "./DeleteButton";
import AssignProject from "@/components/AssignProject";
import { Progress } from "@/components/ui/progress";

interface Props {
  project: Project;
  users: User[];
}

const ProjectDetail = ({ project, users }: Props) => {
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
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <Markdown>{project.description}</Markdown>
          <Progress value={50} />
        </CardContent>
        <CardFooter>
          {project.updatedAt.toLocaleDateString("en-ES", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
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
        <DeleteButton projectId={project.id} />
      </div>
    </div>
  );
};

export default ProjectDetail;
