import { cn } from "@/lib/utils"

type RiskLevel = "low" | "medium" | "high"

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const variants = {
    low: "glass bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/10",
    medium: "glass bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/10",
    high: "glass bg-red-500/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/10",
  }

  const labels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        variants[level],
        className
      )}
    >
      <span className={cn(
        "w-2 h-2 rounded-full mr-2",
        level === "low" && "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse",
        level === "medium" && "bg-amber-500 shadow-lg shadow-amber-500/50 animate-pulse",
        level === "high" && "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
      )} />
      {labels[level]}
    </span>
  )
}
