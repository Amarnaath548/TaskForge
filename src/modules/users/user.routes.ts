import { Router } from "express";
import { createUserHandler, getAllUsersHandler } from "./user.controller.js";

export const userRouter = Router();

userRouter.post("/", createUserHandler);

userRouter.get("/", getAllUsersHandler);
