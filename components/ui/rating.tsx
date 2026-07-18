"use client"

import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
}

export function Rating({ value, onChange, readonly }: RatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={cn(
            "text-2xl transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:text-primary",
            star <= value ? "text-primary" : "text-border"
          )}
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  )
}