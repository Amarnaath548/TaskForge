import { Router } from "express";
import {
  loginHandler,
  refreshHandler,
  registerHandler,
} from "./auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, registerHandler);

authRouter.post("/login", authLimiter, loginHandler);

authRouter.post("/refresh", authLimiter, refreshHandler);
