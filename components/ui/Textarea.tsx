import { type TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import { fieldControl, fieldError, fieldLabel, FieldMessage } from "@/components/ui/Input";

export default function Textarea({
  label,
  id,
  error,
  className,
  ...props
}: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={fieldId} className={fieldLabel}>
        {label}
      </label>
      <textarea
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(fieldControl, "block h-[126px] resize-none", error && fieldError, className)}
        {...props}
      />
      <FieldMessage id={`${fieldId}-error`} message={error} />
    </div>
  );
}
