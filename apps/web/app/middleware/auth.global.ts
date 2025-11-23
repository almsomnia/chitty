export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore()
   const publicRoute = ["/login"]

   if (!authStore.loggedIn && !publicRoute.includes(to.path)) {
      return navigateTo("/login")
   }

   if (authStore.loggedIn && publicRoute.includes(to.path)) {
      return navigateTo("/")
   }
})
