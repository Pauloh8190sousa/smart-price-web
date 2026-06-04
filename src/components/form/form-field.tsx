import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { LucideIcon } from "lucide-react";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  icon?: LucideIcon;
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
  icon: Icon,
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
            <div className="relative">
              {Icon && (
                <Icon
                  className="
        absolute left-3 top-1/2
        size-4 -translate-y-1/2
        text-muted-foreground
        pointer-events-none
      "
                />
              )}

              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={fieldState.invalid}
                className={[
                  "h-12",
                  "rounded-xl",
                  "border-border/60",
                  "bg-background/80",
                  "transition-all",
                  "focus-visible:ring-2",
                  "focus-visible:ring-primary/30",
                  "focus-visible:border-primary/40",
                  Icon && "pl-10",
                ]
                  .filter((value) => Boolean(value))
                  .join(" ")}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
              />
            </div>
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
