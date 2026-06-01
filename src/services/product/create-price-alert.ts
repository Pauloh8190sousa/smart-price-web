// services/price-alert/create-price-alert.ts

import { api } from "@/lib/api";

export async function createPriceAlert(data: {
  targetPrice: number;
  userId: string;
  productId: string;
}) {
  const response = await api.post("/api/price-alerts", data);

  return response.data;
}
