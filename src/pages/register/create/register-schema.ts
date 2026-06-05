import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve possuir pelo menos 3 caracteres"),

    email: z.string().email("Email inválido"),

    password: z.string().min(8, "A senha deve possuir pelo menos 8 caracteres"),

    confirmPassword: z.string().min(8, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
