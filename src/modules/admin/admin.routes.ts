import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uptime } from "process";


export const adminRouter = Router();

adminRouter.get("/stats",authMiddleware,requireRole("ADMIN"),(_req,res)=>{
    res.json({
        user:42,
        uptime:uptime(),
    });
})