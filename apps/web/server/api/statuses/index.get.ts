export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api<API.Response<Model.Status[]>>(`/statuses`, {
      method: "get",
      query
   })
})
