import prisma from "../../config/db.js";
import type { CreateUserInput } from "./user.schema.js";

export const createUser = async (data: CreateUserInput) => {
  return prisma.user.create({
    data: {
      email: data.body.email,
      password: data.body.password,
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};
