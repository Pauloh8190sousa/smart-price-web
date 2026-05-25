import { api } from "@/lib/api";
import type { PriceHistory } from "@/types/price-history";

export async function getProductPriceHistory(productId: string) {
  const response = await api.get<PriceHistory[]>(
    `/api/price-history/product/${productId}`,
  );

  return response.data;
}
