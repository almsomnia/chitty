export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")

   return await $api<API.Response<true>>(`/tasks/${id}`, {
      method: "delete",
   })
})
