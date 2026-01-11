import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { loginUser, refreshAccessToken, registerUser } from "./auth.service.js";
import { AppError } from "../../utils/errors.js";

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

  res
    .status(200)
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      accessToken: tokens.accessToken,
    });
};

export const refreshHandler = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("Unathorized no", 401);

  const accessToken = await refreshAccessToken(token);

  res.json(accessToken);
};
