"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Project } from "@prisma/client";

interface Props {
  projects?: Project[];
}

const ProjectFilter = ({ projects }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParams = searchParams.get("status") || "";
  const projectParams = searchParams.get("project") || "";

  const metaProjects: { label: string; value?: string }[] | undefined =
    projects?.map((project) => ({
      label: project.name,
      value: project.id.toString(),
    }));

  metaProjects?.push({ label: "All", value: "0" });

  return (
    <Select
      defaultValue={projectParams || undefined}
      onValueChange={(project) => {
        const params = new URLSearchParams(searchParams);

        if (project && project !== "0") {
          params.set("project", project);
        } else {
          params.delete("project");
        }

        // const query = params.size ? `${params.toString()}` : "0";
        const query = params.toString();
        router.push(`/tickets?${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by project..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {metaProjects?.map((project) => (
            <SelectItem key={project.value || "0"} value={project.value || "0"}>
              {project.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProjectFilter;
