// services/store/get-store-by-id.ts

import { api } from "@/lib/api";
import type { Store } from "@/types/store";

export async function getStoreById(id: string) {
  const response = await api.get<Store>(`/api/stores/${id}`);

  return response.data;
}
