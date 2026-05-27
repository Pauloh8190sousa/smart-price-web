import { z } from "zod";

function parseCurrency(value: string) {
  return Number(
    value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
}

export const createProductPriceSchema = z.object({
  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .transform(parseCurrency)
    .refine((value) => value > 0, {
      message: "Preço deve ser maior que zero",
    }),

  productUrl: z.string().url("URL inválida").optional().or(z.literal("")),

  available: z.boolean(),

  sellerName: z.string().optional(),

  shippingPrice: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return 0;
      }

      return parseCurrency(value);
    })
    .refine((value) => value >= 0, {
      message: "Frete inválido",
    }),

  installmentQuantity: z.coerce.number().min(1, "Parcelamento inválido"),

  installmentValue: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return 0;
      }

      return parseCurrency(value);
    })
    .refine((value) => value >= 0, {
      message: "Valor da parcela inválido",
    }),

  productId: z.string().uuid("Produto inválido"),

  storeId: z.string().uuid("Loja inválida"),
});

export type CreateProductPriceSchema = z.infer<typeof createProductPriceSchema>;
