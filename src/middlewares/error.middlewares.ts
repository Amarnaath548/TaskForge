import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export const errorMiddlewar = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    logger.warn(
      {
        issues: err.issues,
      },
      "Validation failed"
    );
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    logger.warn({ err }, err.message);
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  logger.error({ err }, "Unhandled error");

  return res.status(500).json({
    message: "Internal server error",
  });
};
