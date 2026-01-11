import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "../../generated/prisma/index.js";


export const requireRole = (...roles: Role[])=>
    (req:AuthRequest, _res:Response, next: NextFunction)=>{
        if(!req.user) throw new AppError("Unathorized", 401);

        if (!roles.includes(req.user.role)){
            throw new AppError("Forbidden", 403);
        }

        next();
    }