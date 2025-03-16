import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Required" }),
});
export const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Minimum of 8 characters required" }),
});

// Add new schema
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    userId: z.string(),
    secret: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyUserSchema = z.object({
  userId: z.string(),
  secret: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;