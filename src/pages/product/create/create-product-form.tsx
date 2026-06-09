// pages/product/create/create-product-form.tsx

import axios from "axios";
import { PackagePlus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Form } from "@/components/form/form";
import { FormField } from "@/components/form/form-field";
import { FormSubmit } from "@/components/form/form-submit";

import {
  createProductSchema,
  type CreateProductSchema,
} from "@/pages/product/create/create-product-schema";

import { createProduct } from "@/services/product/create-product";

import { generateSlug } from "@/lib/utils";

export function CreateProductForm() {
  const navigate = useNavigate();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      brand: "",
      model: "",
      category: "",
      imageUrl: "",
      description: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  async function handleCreateProduct(data: CreateProductSchema) {
    try {
      const product = await createProduct(data);

      toast.success("Produto criado com sucesso");

      navigate(`/products/${product.slug}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Erro ao criar produto";

        toast.error("Falha ao criar produto", {
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
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          Novo produto
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Cadastre um novo produto para monitoramento
        </p>
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={handleCreateProduct}>
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                name="name"
                label="Nome"
                placeholder="Digite o nome do produto"
                onChange={(e) => {
                  const value = e.target.value;

                  form.setValue("name", value);

                  form.setValue("slug", generateSlug(value), {
                    shouldValidate: true,
                  });
                }}
              />

              <FormField name="slug" label="Slug" disabled />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField name="brand" label="Marca" placeholder="Ex: Apple" />

              <FormField
                name="model"
                label="Modelo"
                placeholder="Ex: iPhone 15 Pro"
              />
            </div>

            <FormField
              name="category"
              label="Categoria"
              placeholder="Ex: Smartphones"
            />

            <FormField
              name="imageUrl"
              label="URL da imagem"
              placeholder="https://..."
            />

            {imageUrl && (
              <div className="flex justify-center rounded-xl border border-border/50 bg-muted/20 p-4">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-40 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <FormField
              name="description"
              label="Descrição"
              placeholder="Digite uma descrição do produto"
              textarea
            />

            <div className="mt-8 border-t pt-6">
              <FormSubmit>
                <PackagePlus className="size-4" />
                Criar produto
              </FormSubmit>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
