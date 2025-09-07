import * as React from "react"
import { cn } from "../../utils"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-border bg-input p-3 text-sm leading-6 focus:outline-none",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
