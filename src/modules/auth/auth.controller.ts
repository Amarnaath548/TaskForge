import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { loginUser, registerUser } from "./auth.service.js";

export const registerHandler = async (req: Request, res: Response) => {
  const input = registerSchema.parse(req);
  const user = await registerUser(input.body.email, input.body.password);

  res.status(201).json({
    id: user.id,
    email: user.email,
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const input = loginSchema.parse(req);
  const tokens = await loginUser(input.body.email, input.body.password);

  res.status(200).json(tokens);
};
