// schemas/product/create-product-schema.ts

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),

  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),

  brand: z.string().optional(),

  model: z.string().optional(),

  category: z.string().optional(),

  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),

  description: z
    .string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
