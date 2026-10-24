import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/src/i18n/routing";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  href?: string;
  params?: Record<string, string>;
  isLoading?: boolean;
}

export function Button({ variant = "primary", size = "md", className = "", children, href, params, isLoading, disabled, ...buttonProps }: ButtonProps) {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 rounded-control border font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border-border bg-card text-foreground hover:bg-muted",
    ghost: "border-transparent bg-transparent text-primary hover:bg-muted",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "min-h-12 px-6 py-3 text-base" };
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return <Link href={`${href}${query}` as never} className={`${classes} ${disabled ? "pointer-events-none opacity-50" : ""}`} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined}>{children}</Link>;
  }

  return (
    <button {...buttonProps} className={classes} disabled={disabled || isLoading} aria-busy={isLoading || undefined}>
      {isLoading && <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
      {children}
    </button>
  );
}
