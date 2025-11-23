import { Static, t } from "elysia"
import { spreads } from "@/utils/db/spread"
import { table } from "@/db/tables"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

export const statusDto = spreads({
   insert: createInsertSchema(table.statuses),
   select: createSelectSchema(table.statuses)
})

export const createStatusDto = t.Object({
   ...statusDto.insert
})

export type CreateStatusDto = Static<typeof createStatusDto>

export const updateStatusDto = createStatusDto

export type UpdateStatusDto = Static<typeof updateStatusDto>
