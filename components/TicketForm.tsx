"use client";

import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { ticketSchema } from "@/ValidationSchema/ticket";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
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
import { Ticket } from "@prisma/client";

import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import TicketTracker from "./TicketTracker";

type TicketFormData = z.infer<typeof ticketSchema>;

interface Props {
  projectId?: Number | undefined;
  ticket?: Ticket;
}

const TicketForm = ({ projectId, ticket }: Props) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    console.log({ values });
    try {
      setIsSubmitting(true);
      setError("");
      // if (values.dueDate) {
      //   values.dueDate = new Date(values.dueDate);
      // }
      if (ticket) {
        await axios.patch("/api/tickets/" + ticket.id, values);
      } else {
        values.projectId = Number(projectId);
        // values.assignedToUserId = session?.user.id;
        await axios.post("/api/tickets", values);
      }
      setIsSubmitting(false);

      if (ticket) {
        router.back();
        // router.push("/tickets");
      } else {
        router.push(`/projects/${projectId}`);
      }
      // router.back();
      router.refresh();
    } catch (error) {
      console.log("TicketForm: error " + error);
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
            control={form.control}
            name="title"
            defaultValue={ticket?.title}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Title</FormLabel>
                <FormControl>
                  <Input placeholder="Ticket title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="dueDate"
            defaultValue={ticket?.dueDate}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">Due date</FormLabel>
                <FormControl>
                  <DatePicker
                    className="input"
                    placeholderText="Select date"
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date)}
                    startDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                  />
                </FormControl>
              </FormItem>
            )} 
          /> */}
          <Controller
            name="description"
            control={form.control}
            defaultValue={ticket?.description}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          {/* <div className="flex w-full space-x-12">
            <FormField
              control={form.control}
              name="project"
              defaultValue={project.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Project..."
                          defaultValue={project.name}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="STARTED">Started</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div> */}
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="status"
              defaultValue={ticket?.status}
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
                          defaultValue={ticket?.status}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="STARTED">Started</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              defaultValue={ticket?.priority}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Priority..."
                          defaultValue={ticket?.priority}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {ticket ? "Update ticket" : "Create ticket"}
          </Button>
        </form>
      </Form>
      {ticket && <TicketTracker ticket={ticket} />}
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default TicketForm;
