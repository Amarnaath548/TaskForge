import dotenv from "dotenv";
import { AppError } from "../utils/errors.js";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL as string,
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN!,
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
};

if (!env.DATABASE_URL) {
  throw new AppError("DATABASE_URL is missing");
}

if(!env.REFRESH_SECRET || !env.ACCESS_SECRET){
  throw new AppError("Jwt secret is not found")
}
