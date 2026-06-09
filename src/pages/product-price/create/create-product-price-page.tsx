import logoWeb from "@/assets/logoWeb.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { CreateProductPriceForm } from "./create-product-price-form";

export function CreateProductPricePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <img
            src={logoWeb}
            alt="Smart Price"
            className="h-16 w-auto object-contain"
          />
        </div>

        <CreateProductPriceForm />
      </section>
    </main>
  );
}
