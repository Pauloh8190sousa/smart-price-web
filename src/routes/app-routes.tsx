import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { LoginPage } from "@/pages/login/login-page";

import { ProductPage } from "@/pages/product/product-page";
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

  {
    path: "/products/:slug",
    element: (
      <PrivateRoute>
        <ProductPage />
      </PrivateRoute>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
