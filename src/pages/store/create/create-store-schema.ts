import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  websiteUrl: z.string().url("URL inválida"),
  logoUrl: z.string().url("URL inválida"),
  active: z.boolean(),
});

export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
