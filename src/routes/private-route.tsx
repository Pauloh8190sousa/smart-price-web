import { getToken, logout } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: Props) {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    logout();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
