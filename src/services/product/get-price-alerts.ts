// services/price-alert/get-price-alerts.ts

import { api } from "@/lib/api";

import type { PriceAlert } from "@/types/price-alert";

export async function getPriceAlerts(userId: string) {
  const response = await api.get<PriceAlert[]>(
    `/api/price-alerts/user/${userId}`,
  );

  return response.data;
}
