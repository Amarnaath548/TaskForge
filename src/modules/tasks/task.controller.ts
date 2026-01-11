import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { createTaskSchema } from "./task.schema.js";
import { createTask, getTasksForUser } from "./task.service.js";

export const createTaskHandler = async (req: AuthRequest, res: Response) => {
  const input = createTaskSchema.parse(req);

  const task = await createTask(req.user?.userId!, {
    title: input.body.title,
    ...(input.body.description !== undefined && {
      description: input.body.description,
    }),
    ...(input.body.assigneeId !== undefined && {
      assigneeId: input.body.assigneeId,
    }),
  });

  res.status(201).json(task);
};

export const getTasksHandler = async (req: AuthRequest, res: Response) => {
  const tasks = await getTasksForUser(req.user!);

  res.json(tasks);
};
