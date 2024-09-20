import { z } from "zod";

export const todoSchema = z.object({
  name: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(200),
  status: z.string().min(1, "Status").max(10).optional(),
  steps: z.enum(["2", "3", "5"]).optional(),
  timeDuration: z
    .number()
    .min(1, "Time duration must be at least 1 minute")
    .optional(),
  timeResting: z.enum(["1", "2", "5"]).optional(),
  projectId: z.string().optional(),
  ticketId: z.string().optional(),
});

export const todoPatchSchema = z.object({
  name: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(200),
  status: z.string().min(1, "Status").max(10).optional(),
  steps: z.enum(["2", "3", "5"]).optional(),
  timeDuration: z
    .number()
    .min(1, "Time duration must be at least 1 minute")
    .optional(),
  timeResting: z.enum(["1", "2", "5"]).optional(),
  projectId: z.number().optional(),
  ticketId: z.number().optional(),
});
// export const todoPatchSchema = z.object({
//   title: z.string().min(1, "Title is required").max(255).optional(),
//   description: z.string().min(1, "Description is required").max(200).optional(),
//   status: z.string().min(1, "Status").max(10).optional(),
// });
