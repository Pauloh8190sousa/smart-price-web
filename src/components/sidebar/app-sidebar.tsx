// app-sidebar.tsx
import { Bell, Heart, Package, Store } from "lucide-react";

import logoWeb from "@/assets/logoWeb.png";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useLocation, useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex justify-center py-2">
          <img src={logoWeb} alt="Smart Price" className="h-16 w-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
              className="
  cursor-pointer
  data-[active=true]:bg-primary
  data-[active=true]:text-primary-foreground
"
            >
              <Package />
              <span>Produtos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === "/stores"}
              onClick={() => navigate("/stores")}
              className="
  cursor-pointer
  data-[active=true]:bg-primary
  data-[active=true]:text-primary-foreground
"
            >
              <Store />
              <span>Lojas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === "/alerts"}
              onClick={() => navigate("/alerts")}
              className="
  cursor-pointer
  data-[active=true]:bg-primary
  data-[active=true]:text-primary-foreground
"
            >
              <Bell />
              <span>Alertas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === "/favorites"}
              onClick={() => navigate("/favorites")}
              className="
  cursor-pointer
  data-[active=true]:bg-primary
  data-[active=true]:text-primary-foreground
"
            >
              <Heart />
              <span>Favoritos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
