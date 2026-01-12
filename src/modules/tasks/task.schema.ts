import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    assigneeId: z.uuid().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    assigneeId: z.uuid().nullable(),
  }),
});
