import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", hasError = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`h-11 w-full rounded-lg border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${
        hasError ? "border-red-500 shadow-sm shadow-red-500/10" : "border-border/60 shadow-sm shadow-emerald-500/5"
      } ${className}`}
      {...props}
    />

  );
});
