import type { LoginResponse } from "@/types/auth";

const TOKEN_KEY = "smartprice.token";
const USER_KEY = "smartprice.user";

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);

  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
