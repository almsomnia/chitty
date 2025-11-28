export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const id = getRouterParam(event, "id")

   return await $api<API.Response<Model.Task>>(`/tasks/${id}`, {
      method: "get",
   })
})
