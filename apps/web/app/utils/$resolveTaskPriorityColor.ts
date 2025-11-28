import type { BadgeProps } from "#ui/types"

export default function (priority: Model.Task["priority"]): BadgeProps["color"] {
   switch (priority) {
      case "LOW": return "neutral"
      case "MEDIUM": return "warning"
      case "HIGH": return "error"
      default: throw new Error("Invalid priority")
   }
}
