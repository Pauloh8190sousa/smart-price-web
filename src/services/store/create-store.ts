import { api } from "@/lib/api";
import type { Store } from "@/types/store";

export interface CreateStoreRequest {
  name: string;
  websiteUrl: string;
  logoUrl: string;
  active: boolean;
}

export async function createStore(data: CreateStoreRequest) {
  const response = await api.post<Store>("/api/stores", data);

  return response.data;
}
