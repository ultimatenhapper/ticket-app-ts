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

const statuses: { label: string; value?: string }[] = [
  { label: "Open / Started" },
  { label: "Open", value: "OPEN" },
  { label: "Started", value: "STARTED" },
  { label: "Closed", value: "CLOSED" },
];
const StatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        router.push(`/tickets?${query}`);
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
