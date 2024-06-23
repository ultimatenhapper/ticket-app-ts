"use client";

import { Project } from "@prisma/client";
import Link from "next/link";
// import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface Props {
  project: Project;
}

const PokemonCard = ({ project }: Props) => {
  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="bg-white rounded overflow-hidden shadow-lg">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-800 border-b">
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
              Más información
            </Link>
          </div>
        </div>
        <div className="border-b">
          {/* <div
            onClick={onToggle}
            className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
          >
            <div className="text-red-600">
              {isFavorite ? <IoHeart /> : <IoHeartOutline />}
            </div>
            <div className="pl-3">
              <p className="text-sm font-medium text-gray-800 leading-none">
                {isFavorite ? "Es favorito" : "No es favorito"}
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
