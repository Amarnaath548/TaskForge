import { Router } from "express";
import prisma  from "./config/db.js";

export const router=Router();

router.get("/health",(_req,res)=>{
    res.status(200).json({
        status:"ok",
        timeStamp: new Date().toISOString(),
    });
});

router.post("/users/test",async (_req, res)=>{
    try {
        const user = await prisma.user.create({
        data: {
            email: "test@example.com",
            password: "hashed_password_placeholder",
        },
    });
    res.status(201).json(user);
    } catch (error) {
        console.log(error instanceof Error? error.message:error)
        res.status(400).json({
            status:"error",
            msg:error instanceof Error? error.message:error
        })
    }
    
});

router.get("/users/test",async (_req,res)=>{
    const users= await prisma.user.findMany();
    res.status(200).json(users);
});
