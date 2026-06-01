// services/price-alert/delete-price-alert.ts

import { api } from "@/lib/api";

export async function deletePriceAlert(id: string) {
  await api.delete(`/api/price-alerts/${id}`);
}
