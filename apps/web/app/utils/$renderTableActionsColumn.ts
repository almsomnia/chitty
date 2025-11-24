import type { DropdownMenuItem, DropdownMenuProps } from "@nuxt/ui"
import { UDropdownMenu, UButton } from "#components"

export default function <T>(row: T, menuItems: (row: T) => DropdownMenuItem[]) {
   return h(
      "div",
      {
         class: "text-right",
      },
      h<DropdownMenuProps>(
         UDropdownMenu as any,
         {
            content: {
               align: "end",
            },
            items: menuItems(row),
         },
         () =>
            h(UButton, {
               icon: "lucide:ellipsis-vertical",
               color: "neutral",
               variant: "ghost",
               class: "ml-auto",
            })
      )
   )
}
