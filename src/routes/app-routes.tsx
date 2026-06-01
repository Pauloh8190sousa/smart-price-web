import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { LoginPage } from "@/pages/login/login-page";

import { CreatePriceAlertPage } from "@/pages/price-alert/create/create-price-alert-page";
import { PriceAlertsPage } from "@/pages/price-alert/price-alerts-page";
import { FavoritesPage } from "@/pages/product-favorite/favorites-page";
import { CreateProductPricePage } from "@/pages/product-price/create/create-product-price-page";
import { CreateProductPage } from "@/pages/product/create/create-product-page";
import { ProductPage } from "@/pages/product/product-page";
import { CreateStorePage } from "@/pages/store/create/create-store-page";
import { StorePage } from "@/pages/store/store-page";
import { StoresPage } from "@/pages/store/stores-page";
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
  {
    path: "/products/create",
    element: (
      <PrivateRoute>
        <CreateProductPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/products/:slug/prices/create",
    element: (
      <PrivateRoute>
        <CreateProductPricePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/stores/create",
    element: (
      <PrivateRoute>
        <CreateStorePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/stores/:id",
    element: (
      <PrivateRoute>
        <StorePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/stores",
    element: (
      <PrivateRoute>
        <StoresPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/products/:slug/alerts/create",
    element: (
      <PrivateRoute>
        <CreatePriceAlertPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/alerts",
    element: (
      <PrivateRoute>
        <PriceAlertsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <PrivateRoute>
        <FavoritesPage />
      </PrivateRoute>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
