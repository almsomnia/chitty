export default eventHandler(async (event) => {
   deleteCookie(event, "auth-token", {
      path: "/",
   })
   return {
      meta: {
         success: true,
         message: "Logged out",
         error: "",
      },
      data: true,
   }
})
