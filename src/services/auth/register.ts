import { api } from "@/lib/api";

import type { User } from "@/types/user";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export async function register(data: RegisterRequest) {
  const response = await api.post<User>("/api/auth/register", data);

  return response.data;
}
