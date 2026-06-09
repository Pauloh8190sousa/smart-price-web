import {
  ArrowLeft,
  BarChart3,
  Bell,
  Store,
  TrendingDown,
  TrendingUp
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getUser } from "@/lib/auth";

import { createPriceAlert } from "@/services/product/create-price-alert";
import { getProductBySlug } from "@/services/product/get-product-by-slug";

import logoWeb from "@/assets/logoWeb.png";
import { Form } from "@/components/form/form";
import { FormField } from "@/components/form/form-field";
import { FormSubmit } from "@/components/form/form-submit";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getProductPriceStats } from "@/services/product/get-product-price-stats";
import type { Product } from "@/types/product";
import type { ProductPriceStats } from "@/types/product-price-stats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  type CreatePriceAlertSchema,
  createPriceAlertSchema,
} from "./create-price-alert-schema";

export function CreatePriceAlertPage() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [stats, setStats] = useState<ProductPriceStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<
    z.input<typeof createPriceAlertSchema>,
    any,
    z.output<typeof createPriceAlertSchema>
  >({
    resolver: zodResolver(createPriceAlertSchema),
    mode: "onChange",
    defaultValues: {
      targetPrice: "",
    },
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!slug) {
          navigate("/dashboard");

          return;
        }

        const productData = await getProductBySlug(slug);

        const statsData = await getProductPriceStats(productData.id);

        setProduct(productData);
        setStats(statsData);
      } catch {
        toast.error("Erro ao carregar produto");

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug, navigate]);

  async function handleSubmit(data: CreatePriceAlertSchema) {
    try {
      if (!product) return;

      const user = getUser();

      await createPriceAlert({
        targetPrice: Number(
          data.targetPrice
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim(),
        ),
        userId: user.id,
        productId: product.id,
      });

      toast.success("Alerta criado com sucesso");

      navigate("/alerts");
    } catch {
      toast.error("Erro ao criar alerta");
    }
  }

  if (isLoading || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando produto...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate(`/products/${product.slug}`)}
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

        <Card
          className="
    border-border/50
    bg-card/80
    shadow-xl
    backdrop-blur
  "
        >
          <CardContent className="space-y-6 p-6">
            <div>
              <h1 className="text-2xl font-bold">Criar alerta de preço</h1>

              <p className="text-sm text-muted-foreground">
                Você receberá uma notificação quando o produto atingir ou ficar
                abaixo desse valor.
              </p>
            </div>

            <div
              className="
    flex items-center gap-4
    rounded-xl
    border border-border/50
    bg-card
    p-4
    shadow-sm
  "
            >
              <img
                src={product.imageUrl || "/placeholder-product.png"}
                alt={product.name}
                className="
    h-20 w-20 rounded-xl
    object-contain
    bg-muted/20
    p-2
  "
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder-product.png";
                }}
              />

              <div>
                <p className="text-base font-semibold">{product.name}</p>

                <p className="text-sm text-muted-foreground">
                  {product.brand} • {product.model}
                </p>

                {stats && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="success" className="gap-1 font-semibold">
                      <TrendingDown className="size-3" />
                      Menor: {formatCurrency(String(stats.lowestPrice))}
                    </Badge>

                    <Badge variant="secondary" className="gap-1">
                      <BarChart3 className="size-3" />
                      Média: {formatCurrency(String(stats.averagePrice))}
                    </Badge>

                    <Badge variant="destructive" className="gap-1">
                      <TrendingUp className="size-3" />
                      Maior: {formatCurrency(String(stats.highestPrice))}
                    </Badge>

                    <Badge variant="outline" className="gap-1">
                      <Store className="size-3" />
                      {stats.storesCount} lojas
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Form form={form} onSubmit={handleSubmit}>
              <FormField
                name="targetPrice"
                label="Preço desejado"
                placeholder="R$ 0,00"
                onChange={(e) => {
                  form.setValue("targetPrice", formatCurrency(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-end gap-2">
                  <FormSubmit>
                    <Bell className="size-4" />
                    Criar alerta
                  </FormSubmit>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
