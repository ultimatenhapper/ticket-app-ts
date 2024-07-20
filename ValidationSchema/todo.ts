import { z } from "zod";

export const todoSchema = z.object({
  name: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(200),
  status: z.string().min(1, "Status").max(10).optional(),
});

// export const todoPatchSchema = z.object({
//   title: z.string().min(1, "Title is required").max(255).optional(),
//   description: z.string().min(1, "Description is required").max(200).optional(),
//   status: z.string().min(1, "Status").max(10).optional(),
// });
