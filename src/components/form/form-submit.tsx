import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

type Props = {
  children: React.ReactNode;
};

export function FormSubmit({ children }: Props) {
  const form = useFormContext();

  return (
    <Button
      className="h-11 w-full text-sm font-medium"
      type="submit"
      disabled={form.formState.isSubmitting}
    >
      {form.formState.isSubmitting ? "Entrando..." : children}
    </Button>
  );
}
