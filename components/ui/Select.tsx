import { type SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { fieldControl, fieldError, fieldLabel, FieldMessage } from "@/components/ui/Input";

export default function Select({
  label,
  id,
  options,
  placeholder,
  error,
  className,
  ...props
}: {
  label: string;
  options: string[];
  placeholder?: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={fieldId} className={fieldLabel}>
        {label}
      </label>
      <select
        id={fieldId}
        defaultValue=""
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(
          fieldControl,
          "h-[45px] appearance-none bg-[url(/icons/select-chevron.svg)] bg-[length:10px_6px] bg-[position:right_16px_center] bg-no-repeat py-0 pr-10",
          error && fieldError,
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder ?? ""}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <FieldMessage id={`${fieldId}-error`} message={error} />
    </div>
  );
}
