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

export const taskQuerySchema = z.object({
  status:z.enum(["TODO","IN_PROGRESS","DONE"]).optional(),
  assigneeId: z.uuid().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type taskQueryInput = z.infer<typeof taskQuerySchema>;