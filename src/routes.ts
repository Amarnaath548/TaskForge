import { Router } from "express";
import prisma from "./config/db.js";
import { userRouter } from "./modules/users/user.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { taskRouter } from "./modules/tasks/task.routes.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString(),
  });
});

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/admin", adminRouter);

router.use("/tasks", taskRouter);
