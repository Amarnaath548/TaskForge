import { Router } from "express";
import { userRouter } from "./modules/users/user.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { taskRouter } from "./modules/tasks/task.routes.js";

export const router = Router();

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/admin", adminRouter);

router.use("/tasks", taskRouter);
