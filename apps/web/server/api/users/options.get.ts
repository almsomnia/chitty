export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const query = getQuery(event)

   return await $api<API.Response<API.Option<{ email: string }>[]>>(
      `/users/options`,
      {
         method: "get",
         query,
      }
   )
})
