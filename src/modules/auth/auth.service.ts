import bcrypt from "bcrypt";
import { AppError } from "../../utils/errors.js";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { env } from "../../config/env.js";

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) throw new AppError("Email already exists", 409);

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    env.ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign({ userId: user.id }, env.REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};
