import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "active" | "banned"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    banned: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  return (
    <Badge variant="secondary" className={cn(variants[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
