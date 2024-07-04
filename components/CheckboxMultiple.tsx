"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import { useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

interface Props {
  users: User[];
  assignedUsers: User[] | undefined;
}

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function CheckboxMultiple({ users, assignedUsers }: Props) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const projectId = getCookie("currentProject");

  const items = users.map((user) => ({
    id: user.id,
    label: user.name,
  }));

  const defaultUsers = assignedUsers?.map((user) => user.id) || [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: defaultUsers,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You added the following users:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    setError("");
    setIsAssigning(true);
    try {
      await axios.patch(`/api/projects/${projectId}/assign-users`, {
        userIds: data.items,
      });
    } catch (err) {
      console.log({ err });
      setError("Unable to assign users to the project.");
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Add users</FormLabel>
                <FormDescription>
                  Select users to add to the project
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isAssigning}>
          {" "}
          {isAssigning ? "Assigning..." : "Add"}
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </Form>
  );
}
