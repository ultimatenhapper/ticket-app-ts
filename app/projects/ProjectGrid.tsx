import Image from "next/image";
import { Project } from "@prisma/client";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
}
export const ProjectGrid = ({ projects }: Props) => {
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
