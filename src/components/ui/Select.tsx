import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", hasError = false, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`ui-field h-11 w-full rounded-control border bg-card px-4 text-sm text-foreground shadow-field transition-all focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 ${
        hasError ? "border-red-500" : "border-border/60"
      } ${className}`}
      {...props}
    />
  );
});
