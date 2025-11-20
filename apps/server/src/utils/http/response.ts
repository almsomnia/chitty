import { status, type StatusMap } from "elysia"

type Param = {
   message?: string
   error?: string
   code?: number | keyof StatusMap
}

export function response<T>(
   data: T,
   { message, error, code = 200 }: Param = {}
) {
   const response = Response.json({
      meta: {
         success: !error,
         message: message ?? "",
         error: error ?? "",
      },
      data: data ?? null,
   })

   return status(
      code,
      response
   )
}
