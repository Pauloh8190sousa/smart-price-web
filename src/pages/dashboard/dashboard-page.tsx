import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { removeToken } from "@/lib/auth";

export function DashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();

    toast.success("Logout realizado com sucesso");

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
}
