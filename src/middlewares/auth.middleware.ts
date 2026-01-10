import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export interface JwtUserPayload {
  userId: string;
  role: string;
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) throw new AppError("Unauthorized", 401);

  const token = header.split(" ")[1];
  if (!token) throw new AppError("Unauthorized", 401);

  try {
    const payload = jwt.verify(
      token,
      env.ACCESS_SECRET
    ) as JwtUserPayload & JwtPayload;

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
};
