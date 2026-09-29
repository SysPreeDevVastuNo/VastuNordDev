import { type InputHTMLAttributes } from "react";
import clsx from "clsx";

// Figma form field: 14/20 teal label, 12px gap, 46px white control with a 16px radius.
export const fieldLabel = "block text-sm font-medium leading-5 text-brand-teal";
export const fieldControl =
  "mt-3 rounded-2xl border-stone-200 bg-white px-4 py-3 leading-5 placeholder:text-stone-400 focus:border-brand-teal";
export const fieldError = "border-brand-orange";

export function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs leading-4 text-brand-orange">
      {message}
    </p>
  );
}

export default function Input({
  label,
  id,
  error,
  className,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={fieldId} className={fieldLabel}>
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(fieldControl, error && fieldError, className)}
        {...props}
      />
      <FieldMessage id={`${fieldId}-error`} message={error} />
    </div>
  );
}
