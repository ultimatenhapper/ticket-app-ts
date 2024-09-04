"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const statuses: { label: string; value?: string }[] = [
  { label: "Open / Started" },
  { label: "Open", value: "OPEN" },
  { label: "Started", value: "STARTED" },
  { label: "Closed", value: "CLOSED" },
];
const StatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: projectId } = useParams();
  const projectParams = searchParams.get("project") || "";
  const statusParams = searchParams.get("status") || "";

  return (
    <Select
      defaultValue={statusParams || ""}
      onValueChange={(status) => {
        const params = new URLSearchParams(searchParams);

        if (status && status !== "0") {
          params.set("status", status);
        } else {
          params.delete("status");
        }

        const query = params.toString();
        // const query = params.size ? `${params.toString()}` : "0";
        const url = projectId
          ? `/projects/${projectId}?${query}`
          : `/tickets?${query}`;
        router.push(url);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statuses.map((status) => (
            <SelectItem key={status.value || "0"} value={status.value || "0"}>
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
