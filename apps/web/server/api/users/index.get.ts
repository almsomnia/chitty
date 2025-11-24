export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api<API.Response<API.Paginate<Model.User[]>>>(`/users`, {
      method: "get",
      query
   })
})
