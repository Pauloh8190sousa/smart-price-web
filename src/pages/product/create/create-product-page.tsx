// pages/product/create/create-product-page.tsx

import { Package } from "lucide-react";

import { CreateProductForm } from "./create-product-form";

export function CreateProductPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <Package className="size-8" />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">Smart Price</h1>

            <p className="text-muted-foreground">
              Cadastro e monitoramento inteligente de produtos
            </p>
          </div>
        </div>

        <CreateProductForm />
      </section>
    </main>
  );
}
