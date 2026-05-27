// services/store/get-stores.ts

import { api } from "@/lib/api";

import type { Store } from "@/types/store";

export async function getStores() {
  const response = await api.get<Store[]>("/api/stores");

  return response.data;
}
