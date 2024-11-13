"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Custom hook for debouncing
const useDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const ProjectSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: projectId } = useParams();

  // Initialize searchQuery from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchQuery);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const url = `/projects?${query}`;

    router.push(url);
  }, [debouncedSearch, projectId, router, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full"
        aria-label="Search projects"
      />
    </div>
  );
};

export default ProjectSearch;
