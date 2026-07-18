"use client"

import { useState, useEffect } from "react"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToComparison, removeFromComparison, getComparison } from "@/app/actions/comparison"
import { cn } from "@/lib/utils"

interface ComparisonButtonProps {
  productId: number
  className?: string
}

export function ComparisonButton({ productId, className }: ComparisonButtonProps) {
  const [isInComparison, setIsInComparison] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const list = await getComparison()
        setIsInComparison(list.includes(productId.toString()))
      } catch (error) {
        // Table doesn't exist yet, skip silently
        console.warn("Comparison feature not available:", error)
      }
    }
    check()
  }, [productId])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      if (isInComparison) {
        await removeFromComparison(productId)
        setIsInComparison(false)
      } else {
        await addToComparison(productId)
        setIsInComparison(true)
      }
    } catch (error) {
      // Table doesn't exist yet, skip silently
      console.warn("Comparison feature not available:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "transition-colors",
        isInComparison ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
      title={isInComparison ? "Remove from comparison" : "Add to comparison"}
    >
      <BarChart3 className={cn("h-5 w-5", isInComparison && "fill-current")} />
    </Button>
  )
}
