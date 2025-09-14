import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-[var(--color-text-tertiary)]",
        className
      )}
      style={{
        backgroundColor: 'var(--color-background-secondary)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
        ...props.style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-border-light)';
        e.target.style.backgroundColor = 'var(--color-surface)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--color-border)';
        e.target.style.backgroundColor = 'var(--color-background-secondary)';
        props.onBlur?.(e);
      }}
      {...props}
    />
  )
}

export { Input }
