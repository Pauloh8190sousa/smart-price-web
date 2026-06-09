import { z } from "zod";

export const createPriceAlertSchema = z.object({
  targetPrice: z.string().min(1, "Informe o preço desejado"),
});

export type CreatePriceAlertSchema = z.infer<typeof createPriceAlertSchema>;
