import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    assigneeId: z.uuid().optional(),
  }),
});
