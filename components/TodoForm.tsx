"use client";

import { useState } from "react";
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
import { Todo } from "@prisma/client";

type TodoFormData = z.infer<typeof todoSchema>;

interface Props {
  todo?: Todo;
}

const TodoForm = ({ todo }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  async function onSubmit(values: z.infer<typeof todoSchema>) {
    console.log({ values });

    try {
      setIsSubmitting(true);
      setError("");
      // if (values.dueDate) {
      //   values.dueDate = new Date(values.dueDate);
      // }
      if (todo) {
        await axios.patch("/api/todos/" + todo.id, values);
      } else {
        console.log({ values });
        await axios.post("/api/todos", values);
      }
      setIsSubmitting(false);

      // router.back();
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
            defaultValue={todo?.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo name</FormLabel>
                <FormControl>
                  <Input placeholder="Todo name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            defaultValue={todo?.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo description</FormLabel>
                <FormControl>
                  <Input placeholder="Todo description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="status"
              defaultValue={todo?.status}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Status..."
                          defaultValue={todo?.status}
                        />
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
          </div>
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
