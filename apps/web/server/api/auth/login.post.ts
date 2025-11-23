export default eventHandler(async (event) => {
   const body = await readBody(event)
   const $api = $serverApi(event)

   const response = await $api<
      API.Response<{ token: string; user: Model.User }>
   >("/auth/login", {
      method: "post",
      body,
   })

   setCookie(event, "auth-token", response.data.token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
   })

   return {
      meta: response.meta,
      data: response.data.user,
   }
})
