import * as React from "react"
import { cn } from "../../utils"

export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "outline" }) {
  const styles =
    variant === "outline"
      ? "border border-white/20 text-white/80 px-2 py-0.5 rounded-full"
      : "bg-card text-white px-2 py-0.5 rounded-full"
  return <span className={cn(styles, "text-xs", className)} {...props} />
}
