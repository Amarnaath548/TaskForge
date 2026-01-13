import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  assignTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  updateTaskStatusHandler,
} from "./task.controller.js";

export const taskRouter = Router();

taskRouter.post("/", authMiddleware, createTaskHandler);

taskRouter.get("/", authMiddleware, getTasksHandler);

taskRouter.patch("/:id/status", authMiddleware, updateTaskStatusHandler);

taskRouter.patch("/:id/assign", authMiddleware, assignTaskHandler);

taskRouter.delete("/:id", authMiddleware, deleteTaskHandler);
