export const useAuthStore = defineStore(
   "authStore",
   () => {
      const user = ref<Model.User>()
      const loggedIn = computed(() => {
         const token = useCookie("auth-token")
         return !!token.value
      })

      return {
         user,
         loggedIn,
      }
   },
   {
      persist: true,
   }
)
