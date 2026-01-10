import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "Invalid email address",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  }),
});

export const loginSchema = registerSchema;
