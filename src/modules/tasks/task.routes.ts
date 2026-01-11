import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createTaskHandler, getTasksHandler } from "./task.controller.js";

export const taskRouter = Router();

taskRouter.post("/",authMiddleware, createTaskHandler);

taskRouter.get("/", authMiddleware, getTasksHandler);