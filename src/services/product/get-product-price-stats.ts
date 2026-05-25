import { api } from "@/lib/api";
import type { ProductPriceStats } from "@/types/product-price-stats";

export async function getProductPriceStats(productId: string) {
  const response = await api.get<ProductPriceStats>(
    `/api/product-prices/product/${productId}/stats`,
  );

  return response.data;
}
