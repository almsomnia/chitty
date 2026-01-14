export default eventHandler(async (event) => {
   const $api = $serverApi(event)

   return await $api<API.Response<Model.Task[]>>("/dashboard/tasks-due-today", {
      method: "get",
   })
})
