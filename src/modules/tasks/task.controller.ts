import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  assignTaskSchema,
  createTaskSchema,
  taskQuerySchema,
  updateStatusSchema,
} from "./task.schema.js";
import {
  assignTask,
  createTask,
  deleteTask,
  getTasksForUser,
  updateTaskStatus,
} from "./task.service.js";
import { AppError } from "../../utils/errors.js";

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
  const filters = taskQuerySchema.parse(req.query);

  const tasks = await getTasksForUser(req.user!, filters);

  res.json(tasks);
};

export const updateTaskStatusHandler = async (
  req: AuthRequest,
  res: Response
) => {
  const input = updateStatusSchema.parse(req);

  if (!req.params.id) throw new AppError("Cannot find task id", 400);
  const task = await updateTaskStatus(
    req.params.id,
    req.user!,
    input.body.status
  );

  res.json(task);
};

export const assignTaskHandler = async (req: AuthRequest, res: Response) => {
  const input = assignTaskSchema.parse(req);

  if (!req.params.id) throw new AppError("Cannot find task id", 400);
  const task = await assignTask(
    req.params.id,
    req.user!,
    input.body.assigneeId
  );

  res.json(task);
};

export const deleteTaskHandler = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) {
    throw new AppError("Id not found", 400);
  }
  const result = await deleteTask(req.params.id, req.user!);
  res.status(200).json(result);
};
