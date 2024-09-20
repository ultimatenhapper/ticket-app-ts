"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoCopyOutline,
  IoPlayCircleOutline,
} from "react-icons/io5";

import { Todo } from "@prisma/client";

interface Props {
  todo: Todo;
}

const TodoCard = ({ todo }: Props) => {
  const router = useRouter();
  const isDone = todo.status === "DONE";
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    try {
      setIsUpdating(true);
      await axios.delete("/api/todos/" + todo.id);
      router.refresh();
    } catch (error) {
      setIsUpdating(false);
      setError("Unknown Error Occurred");
    }
  };

  // const handleDuplicate = async () => {
  //   try {
  //     setIsUpdating(true);
  //     setError("");

  //     await axios.post("/api/todos", {
  //       ...todo,
  //     });

  //     setIsUpdating(false);
  //     router.refresh();
  //   } catch (error) {
  //     console.log("TicketForm: error " + error);
  //     setError("Unknown Error occurred");
  //     setIsUpdating(false);
  //   }
  // };

  const handlePomodoro = () => {
    console.log("Handling pomodoro...");
    router.push(`todos/${todo.id}`);
    router.refresh();
  };

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      setError("");

      await axios.patch("/api/todos/" + todo.id, {
        ...todo,
        status: isDone ? "PENDING" : "DONE",
      });

      setIsUpdating(false);
      router.refresh();
    } catch (error) {
      console.log("TodoCard: error " + error);
      setError("Unknown Error occurred");
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="bg-white rounded overflow-hidden shadow-lg">
        <div
          className={`flex flex-col items-center justify-center text-center p-6 border-b rounded-xl ${
            isDone ? "bg-green-400" : "bg-red-400"
          }`}
        >
          <p
            className={`pt-2 text-lg font-semibold text-gray-900 capitalize ${
              isDone ? "line-through" : ""
            }`}
          >
            {todo.name}
          </p>
          <p
            className={`mt-2 text-sm text-gray-700 ${
              isDone ? "line-through" : ""
            }`}
          >
            {todo.description}
          </p>
          <div className="mt-5">
            <Link
              href={`/todos/edit/${todo.id}`}
              className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-900"
            >
              More info
            </Link>
          </div>
        </div>
        <div className="flex justify-between p-4">
          <button
            onClick={handlePomodoro}
            className="text-blue-500 hover:text-blue-700"
            disabled={todo.status === "DONE"}
          >
            <IoPlayCircleOutline size={24} />
          </button>

          <button
            onClick={handleToggle}
            className={`text-green-500 hover:text-green-700 ${
              isDone ? "text-green-700" : "text-green-500"
            }`}
          >
            <IoCheckmarkCircleOutline size={24} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            disabled={isUpdating}
            onClick={handleDelete}
          >
            <IoTrashOutline size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
