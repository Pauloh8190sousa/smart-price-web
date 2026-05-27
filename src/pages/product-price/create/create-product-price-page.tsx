// pages/product-price/create/create-product-price-page.tsx

import logoWeb from "@/assets/logoWeb.png";

import { CreateProductPriceForm } from "./create-product-price-form";

export function CreateProductPricePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <img
              src={logoWeb}
              alt="Smart Price"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        <CreateProductPriceForm />
      </section>
    </main>
  );
}
