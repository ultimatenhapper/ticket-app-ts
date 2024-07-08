"use client";

import AssignProject from "@/components/AssignProject";
import { Project } from "@prisma/client";
import Link from "next/link";
// import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="bg-white rounded overflow-hidden shadow-lg">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-sky-600 border-b rounded-xl">
          {/* <Image
            key={pokemon.id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            width={100}
            height={100}
            alt={pokemon.name}
            priority={false}
          /> */}
          <p className="pt-2 text-lg font-semibold text-gray-50 capitalize">
            {project.name}
          </p>
          <div className="mt-5">
            <Link
              href={`/projects/${project.id}`}
              className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-100"
            >
              More info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
