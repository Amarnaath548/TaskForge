import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingId = req.headers["x-request-id"];
  const id = typeof incomingId === "string" ? incomingId : randomUUID();

  req.id = id;
  res.setHeader("x-request-id", id);

  next();
};
