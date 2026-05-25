// services/product/create-product.ts

import { api } from "@/lib/api";

import type { CreateProductSchema } from "@/pages/product/create/create-product-schema";
import type { Product } from "@/types/product";

export async function createProduct(data: CreateProductSchema) {
  const response = await api.post<Product>("/api/products", data);

  return response.data;
}
