import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

type Props = {
  children: React.ReactNode;
};

export function FormSubmit({ children }: Props) {
  const form = useFormContext();

  return (
    <Button
      className="
        h-14
        w-full
        rounded-xl
        text-base
        font-semibold
        cursor-pointer
        transition-all
        hover:scale-[1.01]
        hover:shadow-lg
        hover:shadow-primary/20
        hover:bg-primary/90
        active:scale-[0.99]
        disabled:opacity-70
        disabled:cursor-not-allowed
      "
      type="submit"
      disabled={form.formState.isSubmitting}
    >
      {form.formState.isSubmitting ? "Entrando..." : children}
    </Button>
  );
}
