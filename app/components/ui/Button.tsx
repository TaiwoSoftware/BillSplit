import { ButtonHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",

        {
          "bg-blue-600 text-white hover:bg-blue-700":
            variant === "primary",

          "bg-slate-100 text-slate-900 hover:bg-slate-200":
            variant === "secondary",

          "border border-slate-300 bg-white hover:bg-slate-50":
            variant === "outline",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",

          "px-3 py-2 text-sm": size === "sm",

          "px-5 py-3": size === "md",

          "px-6 py-4 text-lg": size === "lg",
        },

        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}