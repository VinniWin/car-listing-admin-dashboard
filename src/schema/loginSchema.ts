import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type Tlogin = z.infer<typeof loginSchema>;
