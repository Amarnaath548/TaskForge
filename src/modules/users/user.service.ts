import prisma from "../../config/db.js";
import { AppError } from "../../utils/errors.js";
import type { CreateUserInput } from "./user.schema.js";

export const createUser = async (data: CreateUserInput) => {
    const existing =await prisma.user.findUnique({
        where: {email: data.body.email}
    });

    if (existing){
        throw new AppError("Email alredy exists", 409)
    }

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
