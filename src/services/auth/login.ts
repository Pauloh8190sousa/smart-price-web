import { api } from "@/lib/api";

import type { LoginSchema } from "@/pages/login/login-schema";
import type { LoginResponse } from "@/types/auth";

export async function login(data: LoginSchema) {
  const response = await api.post<LoginResponse>("/api/auth/login", data);

  return response.data;
}
