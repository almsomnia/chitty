import type {
   NitroFetchRequest,
   NitroFetchOptions,
   TypedInternalResponse,
} from "nitropack"
import type { H3Error } from "h3"
import type { FetchOptions } from "ofetch"

export default function <T = unknown, R extends NitroFetchRequest = NitroFetchRequest> (
   endpoint: R,
   config?: FetchOptions
): Promise<TypedInternalResponse<R, T>> {
   const handler = $fetch.create({
      onRequest: async ({ options }) => {
         options.headers.set("Accept", "application/json")
      },
      onResponseError: ({ response }) => {
         const res = response._data as H3Error<API.Response<unknown>>

         const toast = useToast()
         toast.add({
            title: "Error",
            description: res.message,
            color: "error"
         })
      }
   })

   return handler(endpoint, config as NitroFetchOptions<R>)
}
