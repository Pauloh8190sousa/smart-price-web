import { api } from "@/lib/api";
import type { ProductPrice } from "@/types/product-price";

export async function getProductPrices(productId: string) {
  const response = await api.get<ProductPrice[]>(
    `/api/product-prices/product/${productId}`,
  );

  return response.data;
}
