import type { HTMLAttributes, ReactNode } from "react";

type StatusAlertProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: "success" | "error" | "info";
  children: ReactNode;
};

const toneClasses = {
  success: "border-primary text-primary",
  error: "border-red-600 text-red-700 dark:border-red-400 dark:text-red-300",
  info: "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300",
};

export function StatusAlert({ tone = "info", className = "", children, role, ...props }: StatusAlertProps) {
  return <p className={`m-0 border-l-[3px] px-3 py-2 text-sm leading-relaxed ${toneClasses[tone]} ${className}`} role={role ?? (tone === "error" ? "alert" : "status")} {...props}>{children}</p>;
}
