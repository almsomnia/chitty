import { H3Event } from "h3"

export default function (event: H3Event) {
   const runtimeConfig = useRuntimeConfig(event)
   const token = getCookie(event, "auth-token")

   return $fetch.create({
      baseURL: runtimeConfig.apiUrl,
      retry: 0,
      onRequest: ({ options }) => {
         options.headers.set("Accept", "application/json")
         if (token) {
            options.headers.set("Authorization", `Bearer ${token}`)
         }
      },

      onResponseError: ({ response, error }) => {
         if (response.status === 401) {
            deleteCookie(event, "auth-token", {
               path: "/",
            })
         }

         const res = response._data as API.Response<unknown>

         throw (
            error ??
            createError({
               statusCode: response.status,
               statusMessage: response.statusText,
               message: res.meta.error,
               data: res
            })
         )
      },
   })
}
