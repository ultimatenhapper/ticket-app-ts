"use client";

import axios, { AxiosResponse } from "axios";
import { Star, StarOff } from "lucide-react";
import AssignProject from "@/components/AssignProject";
import { Project } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface Props {
  project: Project;
}

const ProjectCard = ({ project: initialProject }: Props) => {
  const [project, setProject] = useState(initialProject);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleFavorite = async () => {
    setError("");
    setIsAssigning(true);
    try {
      const response: void | AxiosResponse<Project> =
        await axios.patch<Project>(`/api/projects/${project.id}`, {
          ...project,
          isFavorite: !project.isFavorite,
        });
      if (response.data) {
        setProject(response.data);
        router.refresh(); // This will trigger a re-fetch of the server components
      }
    } catch {
      setError("Unable to update project");
    }
    setIsAssigning(false);
  };

  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="bg-white rounded overflow-hidden shadow-lg">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-sky-600 border-b rounded-xl">
          <div className="flex flex-row">
            <p className="pt-2 text-lg font-semibold text-gray-50 capitalize mr-2">
              {project.name}
            </p>
            <button
              className="focus:outline-none ml-2"
              onClick={toggleFavorite}
            >
              {project.isFavorite ? (
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
              ) : (
                <StarOff className="text-gray-300" size={24} />
              )}
            </button>
          </div>

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
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default ProjectCard;
