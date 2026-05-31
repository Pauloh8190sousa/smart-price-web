// services/store/get-store-products.ts

import { api } from "@/lib/api";

import type { ProductPrice } from "@/types/product-price";

export async function getStoreProducts(storeId: string) {
  const response = await api.get<ProductPrice[]>(
    `/api/product-prices/store/${storeId}`,
  );

  return response.data;
}
