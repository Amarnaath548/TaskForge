import { Router } from "express";
import prisma from "./config/db.js";
import { userRouter } from "./modules/users/user.routes.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString(),
  });
});

router.use("/users", userRouter);
