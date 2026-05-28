import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export function FormField({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  textarea = false,
  onChange,
}: Props) {
  const form = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

          {textarea ? (
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                field.onChange(e);

                onChange?.(e);
              }}
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className="
                h-12
                rounded-xl
                border-border/60
                bg-background/80
                transition-all
                focus-visible:ring-2
                focus-visible:ring-primary/30
                focus-visible:border-primary/40
              "
              onChange={(e) => {
                field.onChange(e);

                onChange?.(e);
              }}
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
