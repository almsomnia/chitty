export default eventHandler(async (event) => {
   const $api = $serverApi(event)

   return await $api<API.Response<Model.Task[]>>("/dashboard/overdue-tasks", {
      method: "get",
   })
})
