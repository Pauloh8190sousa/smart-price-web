import axios from "axios";

import { ArrowLeft, DollarSign } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Field, FieldLabel } from "@/components/ui/field";

import { Form } from "@/components/form/form";

import { FormField } from "@/components/form/form-field";

import { FormSubmit } from "@/components/form/form-submit";

import {
  createProductPriceSchema,
  type CreateProductPriceSchema,
} from "@/pages/product-price/create/create-product-price-schema";

import { createProductPrice } from "@/services/product/create-product-price";

import { getProductBySlug } from "@/services/product/get-product-by-slug";

import { getStores } from "@/services/store/get-stores";

import type { Product } from "@/types/product";

import { formatCurrency } from "@/lib/utils";
import type { Store } from "@/types/store";

export function CreateProductPriceForm() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [stores, setStores] = useState<Store[]>([]);

  const form = useForm<
    z.input<typeof createProductPriceSchema>,
    any,
    z.output<typeof createProductPriceSchema>
  >({
    resolver: zodResolver(createProductPriceSchema),
    mode: "onChange",
    defaultValues: {
      price: "",
      productUrl: "",
      available: true,
      sellerName: "",
      shippingPrice: "",
      installmentQuantity: 1,
      installmentValue: "",
      storeId: "",
      productId: "",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        if (!slug) {
          navigate("/dashboard");

          return;
        }

        const [productData, storesData] = await Promise.all([
          getProductBySlug(slug),
          getStores(),
        ]);

        setProduct(productData);

        setStores(storesData);

        form.setValue("productId", productData.id);
      } catch {
        toast.error("Erro ao carregar dados");

        navigate("/dashboard");
      }
    }

    loadData();
  }, [slug, navigate, form]);

  async function handleCreatePrice(data: CreateProductPriceSchema) {
    try {
      await createProductPrice(data);

      toast.success("Preço cadastrado com sucesso");

      navigate(`/products/${slug}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Erro ao cadastrar preço";

        toast.error("Falha ao cadastrar preço", {
          description: message,
        });

        return;
      }

      toast.error("Erro inesperado");
    }
  }

  return (
    <Card
      className="
        border-border/50
        bg-card/80
        shadow-xl
        backdrop-blur
      "
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Novo preço
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Adicione um novo preço monitorado
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        </div>

        {product && (
          <div
            className="
              flex items-center gap-4 rounded-2xl
              border border-border/50 bg-muted/30 p-4
            "
          >
            <img
              src={product.imageUrl || "/placeholder-product.png"}
              alt={product.name}
              className="
  h-20 w-20 rounded-xl
  object-contain bg-muted/30 p-2
"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-product.png";
              }}
            />

            <div>
              <p className="text-sm text-muted-foreground">
                Produto selecionado
              </p>

              <h3 className="text-lg font-semibold">{product.name}</h3>

              <p className="text-sm text-muted-foreground">
                {product.brand} • {product.model}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={handleCreatePrice}>
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                name="price"
                label="Preço"
                placeholder="R$ 0,00"
                onChange={(e) => {
                  form.setValue("price", formatCurrency(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />

              <Field>
                <FieldLabel>Loja</FieldLabel>

                <Select
                  value={form.watch("storeId")}
                  onValueChange={(value) =>
                    form.setValue("storeId", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>

                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {form.formState.errors.storeId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.storeId.message}
                  </p>
                )}
              </Field>
            </div>

            <FormField
              name="productUrl"
              label="URL do produto"
              placeholder="https://..."
            />

            <FormField
              name="sellerName"
              label="Vendedor"
              placeholder="Ex: Loja Oficial"
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                name="shippingPrice"
                label="Frete"
                placeholder="R$ 0,00"
                onChange={(e) => {
                  form.setValue(
                    "shippingPrice",
                    formatCurrency(e.target.value),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
              />

              <FormField
                name="installmentQuantity"
                type="number"
                label="Parcelas"
                placeholder="1"
              />

              <FormField
                name="installmentValue"
                label="Valor da parcela"
                placeholder="R$ 0,00"
                onChange={(e) => {
                  form.setValue(
                    "installmentValue",
                    formatCurrency(e.target.value),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
              />
            </div>

            <Field className="flex items-center justify-between rounded-xl border border-border/50 p-4">
              <div>
                <FieldLabel>Disponível</FieldLabel>

                <p className="text-sm text-muted-foreground">
                  Produto disponível para compra
                </p>
              </div>

              <Switch
                checked={form.watch("available")}
                onCheckedChange={(checked) =>
                  form.setValue("available", checked)
                }
              />
            </Field>

            <div className="flex justify-end">
              <FormSubmit>
                <DollarSign className="size-4" />
                Cadastrar preço
              </FormSubmit>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
