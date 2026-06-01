// services/price-alert/toggle-price-alert.ts

import { api } from "@/lib/api";

export async function togglePriceAlert(id: string) {
  const response = await api.patch(`/api/price-alerts/${id}/toggle`);

  return response.data;
}
