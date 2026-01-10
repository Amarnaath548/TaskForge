import { Router } from "express";
import { createUserHandler, getAllUsersHandler } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.post("/", createUserHandler);

userRouter.get("/", authMiddleware, getAllUsersHandler);
