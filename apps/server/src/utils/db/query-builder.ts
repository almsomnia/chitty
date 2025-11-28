import { db } from "@/db"
import { PgSelect, PgTableWithColumns } from "drizzle-orm/pg-core"
import { asc, desc } from "drizzle-orm"

export async function paginate<T extends PgSelect>(
   qb: T,
   page: number | string | undefined,
   perPage: number | string | undefined
) {
   const count = await db.$count(qb)

   const _page = (page && Number(page)) || 1
   const _perPage = (perPage && Number(perPage)) || count

   const offset = (_page - 1) * _perPage
   const limit = _perPage

   const data = await qb.limit(limit).offset(offset)

   const from = offset + 1
   const to = Math.min(offset + _perPage, count)

   return {
      page: _page,
      per_page: _perPage,
      data,
      from,
      to,
      total: count,
   }
}

export function order<T extends PgTableWithColumns<any>, K extends keyof T["_"]["columns"]>(
   table: T,
   key: K | (string & {}),
   dir: "asc" | "desc" | (string & {})
) {
   const handler = dir == "asc" ? asc : desc
   return handler(table[key])
}
