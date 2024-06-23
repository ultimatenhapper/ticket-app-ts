"use client";

import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { projectSchema } from "@/ValidationSchema/project";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";

import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";

type ProjectFormData = z.infer<typeof projectSchema>;

interface Props {
  project?: Project;
}
const ProjectForm = ({ project }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (project) {
        await axios.patch("/api/projects/" + project.id, values);
      } else {
        await axios.post("/api/projects", values);
      }
      setIsSubmitting(false);

      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.log("ProjectForm: error");
      setError("Unknown Error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="rounded-md border w-full p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              defaultValue={project?.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              defaultValue={project?.description}
              render={({ field }) => (
                <SimpleMDE placeholder="Description" {...field} />
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {project ? "Update project" : "Create project"}
            </Button>
          </form>
        </Form>
        <p className="text-destructive">{error}</p>
      </div>
    </>
  );
};

export default ProjectForm;
