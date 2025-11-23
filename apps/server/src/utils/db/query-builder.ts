import { PgSelect } from "drizzle-orm/pg-core"

export async function paginate<T extends PgSelect>(
   qb: T,
   page: number | string | undefined,
   perPage: number | string | undefined,
   count: number
) {
   const _page = (page && Number(page)) || 1
   const _perPage = (perPage && Number(perPage)) || count

   const offset = (_page - 1) * _perPage
   const limit = _perPage

   const data = await qb.limit(limit).offset(offset)

   return {
      page: _page,
      per_page: _perPage,
      data,
      from: offset + 1,
      to: offset + _perPage,
      total: count,
   }
}
