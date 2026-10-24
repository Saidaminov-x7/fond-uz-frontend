import type { HTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={`rounded-card border border-border bg-card text-card-foreground shadow-card ${className}`} {...props}>{children}</div>;
}
