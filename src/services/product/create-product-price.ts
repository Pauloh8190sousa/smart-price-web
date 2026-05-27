// services/product-price/create-product-price.ts

import { api } from "@/lib/api";

import type { CreateProductPriceSchema } from "@/pages/product-price/create/create-product-price-schema";

import type { ProductPrice } from "@/types/product-price";

export async function createProductPrice(data: CreateProductPriceSchema) {
  const response = await api.post<ProductPrice>("/api/product-prices", data);

  return response.data;
}
