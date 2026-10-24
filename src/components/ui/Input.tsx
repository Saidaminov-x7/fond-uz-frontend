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
      className={`ui-field h-11 w-full rounded-control border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground shadow-field transition-all disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${
        hasError ? "border-red-500" : "border-border/60"
      } ${className}`}
      {...props}
    />

  );
});
