import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = "", hasError = false, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`min-h-[120px] w-full rounded-lg border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${
        hasError ? "border-red-500 shadow-sm shadow-red-500/10" : "border-border/60 shadow-sm shadow-emerald-500/5"
      } ${className}`}
      {...props}
    />

  );
});
