import { ArrowLeft, Bell } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getUser } from "@/lib/auth";

import { createPriceAlert } from "@/services/product/create-price-alert";
import { getProductBySlug } from "@/services/product/get-product-by-slug";

import type { Product } from "@/types/product";

export function CreatePriceAlertPage() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [targetPrice, setTargetPrice] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!slug) {
          navigate("/dashboard");

          return;
        }

        const data = await getProductBySlug(slug);

        setProduct(data);
      } catch {
        toast.error("Erro ao carregar produto");

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug, navigate]);

  async function handleSubmit() {
    try {
      if (!product) {
        return;
      }

      const user = getUser();

      setIsSaving(true);

      await createPriceAlert({
        targetPrice: Number(targetPrice),
        userId: user.id,
        productId: product.id,
      });

      toast.success("Alerta criado com sucesso");

      navigate("/alerts");
    } catch {
      toast.error("Erro ao criar alerta");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-3xl p-6">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(`/products/${product.slug}`)}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Card>
          <CardContent className="space-y-6 p-6">
            <div>
              <h1 className="text-2xl font-bold">Criar alerta de preço</h1>

              <p className="text-muted-foreground">
                Você será notificado quando o produto atingir o preço desejado.
              </p>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="font-medium">{product.name}</p>

              <p className="text-sm text-muted-foreground">
                {product.brand} • {product.model}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preço desejado</label>

              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 4500"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                Cancelar
              </Button>

              <Button onClick={handleSubmit} disabled={isSaving}>
                <Bell className="size-4" />

                {isSaving ? "Criando..." : "Criar alerta"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
