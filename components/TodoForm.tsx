"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { todoSchema } from "@/ValidationSchema/todo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Project, Ticket, Todo, TodoStatus } from "@prisma/client";

type TodoFormData = z.infer<typeof todoSchema>;

interface Props {
  todo?: Todo;
  projects?: Project[];
}

const TodoForm = ({ todo, projects }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userProjects, setUserProjects] = useState<Project[]>(projects || []);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const allowedStepsValues = ["2", "3", "5"] as const;
  type StepsType = (typeof allowedStepsValues)[number];

  function parseSteps(steps?: string | null): StepsType | undefined {
    if (allowedStepsValues.includes(steps as StepsType)) {
      return steps as StepsType;
    }
    return undefined;
  }

  const allowedTimeRestingValues = ["1", "2", "5"] as const;
  type TimeRestingType = (typeof allowedTimeRestingValues)[number];

  function parseTimeResting(
    timeResting?: string | null
  ): TimeRestingType | undefined {
    if (allowedTimeRestingValues.includes(timeResting as TimeRestingType)) {
      return timeResting as TimeRestingType;
    }
    return undefined;
  }

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
      status: todo?.status || "PENDING",
      steps: parseSteps(todo?.steps) || "3",
      timeDuration: todo?.timeDuration || 25,
      timeResting: parseTimeResting(todo?.timeResting) || "2",
      projectId: todo?.projectId.toString() || "",
      ticketId: todo?.ticketId.toString() || "",
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/users/${session?.user?.id}`);
        setUserProjects(response.data.projects);
      } catch (err) {
        setError("Unable to fetch the projects...");
      }
    };
    if (!projects && userProjects.length === 0) {
      fetchProjects();
    }
  }, [projects, session, userProjects.length]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const projectId = form.watch("projectId");
        if (projectId) {
          const response = await axios.get(`/api/projects/${projectId}`);
          setFilteredTickets(response.data?.tickets);
        } else {
          setFilteredTickets([]);
        }
      } catch (error) {
        setError("Error fetching the tickets...");
      }
    };

    fetchTickets();
  }, [form.watch("projectId")]);

  async function onSubmit(values: TodoFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (todo) {
        await axios.patch("/api/todos/" + todo.id, values);
      } else {
        await axios.post("/api/todos", values);
      }
      setIsSubmitting(false);
      router.push("/todos");
      router.refresh();
    } catch (error) {
      console.log("todoForm: error " + error);
      setError("Unknown Error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo name</FormLabel>
                <FormControl>
                  <Input placeholder="Todo name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo description</FormLabel>
                <FormControl>
                  <Input placeholder="Todo description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Steps</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resting time..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2">2 steps</SelectItem>
                    <SelectItem value="3">3 steps</SelectItem>
                    <SelectItem value="5">5 steps</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="timeDuration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeResting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Resting</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resting time..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="2">2 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userProjects && userProjects.length > 0 ? (
                      userProjects.map((project) => (
                        <SelectItem
                          key={project.id}
                          value={project.id.toString()}
                        >
                          {project.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="No projects" disabled>
                        No projects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticketId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Ticket</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                  disabled={!form.watch("projectId")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ticket..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredTickets.map((ticket) => (
                      <SelectItem key={ticket.id} value={ticket.id.toString()}>
                        {ticket.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {todo ? "Update todo" : "Create todo"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default TodoForm;
