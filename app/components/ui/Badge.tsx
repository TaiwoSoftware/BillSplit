import { cn } from "@/app/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger";
}

export default function Badge({
  children,
  variant = "success",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium",

        {
          "bg-green-100 text-green-700":
            variant === "success",

          "bg-yellow-100 text-yellow-700":
            variant === "warning",

          "bg-red-100 text-red-700":
            variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}