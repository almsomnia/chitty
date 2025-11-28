import type { BadgeProps } from "#ui/types";

export default function (status: Model.Status): BadgeProps["color"] {
   switch (status.type) {
      case "IDLE": return "neutral"
      case "ACTIVE": return "info"
      case "CLOSE": return "success"
      default: throw new Error("Invalid status type")
   }
}
