import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

type Props = {
  children: React.ReactNode;
};

export function FormSubmit({ children }: Props) {
  const form = useFormContext();

  return (
    <Button
      className="w-full"
      type="submit"
      disabled={form.formState.isSubmitting}
    >
      {form.formState.isSubmitting ? "Entrando..." : children}
    </Button>
  );
}
