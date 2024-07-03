"use client";

import axios from "axios";
import { useState } from "react";

import { Project, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CheckboxMultiple } from "./CheckboxMultiple";

const AssignProject = ({
  project,
  users,
}: {
  project: Project;
  users: User[];
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");

  const assigningUsers = async () => {
    setIsAssigning(!isAssigning);
  };

  return (
    <>
      <div className="flex justify-start align-items">
        <button onClick={() => assigningUsers()}>
          <IoPersonCircleOutline style={{ height: 100, width: 100 }} />
        </button>
        <div className="ml-3">
          {isAssigning && <CheckboxMultiple users={users} />}
        </div>
      </div>
    </>
  );
};

export default AssignProject;
