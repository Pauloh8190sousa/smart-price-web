import axios from "axios";

import { ArrowLeft, Store as StoreIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

import { Field, FieldLabel } from "@/components/ui/field";

import { Form } from "@/components/form/form";

import { FormField } from "@/components/form/form-field";

import { FormSubmit } from "@/components/form/form-submit";

import {
  createStoreSchema,
  type CreateStoreSchema,
} from "./create-store-schema";

import { createStore } from "@/services/store/create-store";

export function CreateStoreForm() {
  const navigate = useNavigate();

  const form = useForm<CreateStoreSchema>({
    resolver: zodResolver(createStoreSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      websiteUrl: "",
      logoUrl: "",
      active: true,
    },
  });

  async function handleCreateStore(data: CreateStoreSchema) {
    try {
      const store = await createStore(data);

      toast.success("Loja criada com sucesso");

      navigate(`/stores/${store.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Erro ao criar loja";

        toast.error("Falha ao criar loja", {
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
              Nova loja
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Cadastre uma nova loja para monitoramento de preços
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={handleCreateStore}>
          <div className="grid gap-6">
            <FormField
              name="name"
              label="Nome da loja"
              placeholder="Ex: Amazon"
            />

            <FormField
              name="websiteUrl"
              label="Website"
              placeholder="https://www.amazon.com.br"
            />

            <FormField
              name="logoUrl"
              label="URL da logo"
              placeholder="https://..."
            />

            <Field className="flex items-center justify-between rounded-xl border border-border/50 p-4">
              <div>
                <FieldLabel>Loja ativa</FieldLabel>

                <p className="text-sm text-muted-foreground">
                  Define se a loja estará disponível para novos preços
                </p>
              </div>

              <Switch
                checked={form.watch("active")}
                onCheckedChange={(checked) => form.setValue("active", checked)}
              />
            </Field>

            <div className="flex justify-end">
              <FormSubmit>
                <StoreIcon className="size-4" />
                Criar loja
              </FormSubmit>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
