import type { Request, Response } from "express";
import { createUserSchema } from "./user.schema.js";
import { createUser, getAllUsers } from "./user.service.js";

export const createUserHandler = async (req: Request, res: Response) => {
  const input = createUserSchema.parse(req);

  const user = await createUser(input);

  res.status(201).json(user);
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const allUsers = await getAllUsers();

  res.status(200).json(allUsers);
};
