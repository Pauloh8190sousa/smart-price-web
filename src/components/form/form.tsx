import type { UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
};

export function Form({ form, onSubmit, children }: Props) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
