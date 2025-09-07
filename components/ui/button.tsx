import * as React from "react"
import { cn } from "../../utils"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none"
    const variants: Record<string, string> = {
      default: "bg-primary text-black hover:opacity-90",
      outline: "border border-border bg-transparent hover:bg-card/40",
      ghost: "bg-transparent hover:bg-card/40",
      secondary: "bg-card text-foreground hover:bg-card/60"
    }
    const sizes: Record<string, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base"
    }
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  }
)
Button.displayName = "Button"
