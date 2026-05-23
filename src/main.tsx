import ReactDOM from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";

import { AppRoutes } from "./routes/app-routes";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AppRoutes />
    <Toaster position="top-center" richColors closeButton duration={3000} />
  </>,
);
