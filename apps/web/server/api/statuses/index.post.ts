export default eventHandler(async (event) => {
   const $api = $serverApi(event)
   const body = await readBody(event)

   return await $api<API.Response<Model.Status[]>>(`/statuses`, {
      method: "post",
      body
   })
})
