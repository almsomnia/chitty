export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)
   const id = getRouterParam(event, "id")

   return await $api<API.Response<Model.User>>(`/users/${id}`, {
      method: "put",
      body,
   })
})
