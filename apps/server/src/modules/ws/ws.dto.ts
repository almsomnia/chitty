import { table } from "@/db/tables"

export interface MessageData {
   ping: null
   "subscribe:task": null
   "task:update": typeof table.tasks.$inferSelect
   "task:create": typeof table.tasks.$inferInsert
   "task:publish-updated": typeof table.tasks.$inferSelect
}

export type MessageType = keyof MessageData
