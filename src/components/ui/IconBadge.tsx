import type { ReactNode } from "react";

export function IconBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon-badge ${className}`}>
      {children}
    </span>
  );
}
