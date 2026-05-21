import { getToken } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </main>
  );
}
