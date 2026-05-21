import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { LoginPage } from "@/pages/login/login-page";

import { PrivateRoute } from "./private-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
