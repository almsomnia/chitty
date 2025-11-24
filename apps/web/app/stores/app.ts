type Dialog = {
   show: boolean
   title: string
   body: ReturnType<typeof h>
   class?: string
}

export const useAppStore = defineStore("appStore", () => {
   const dialog = ref<Dialog>({
      show: false,
      title: "",
      body: h("div"),
      class: "w-min"
   })

   function showDialog(title: string, body: ReturnType<typeof h>, config?: Omit<Dialog, "title" | "body" | "show">) {
      dialog.value.title = title
      dialog.value.body = body
      dialog.value.class = config?.class ?? "w-min"
      dialog.value.show = true
   }

   function closeDialog() {
      dialog.value.show = false
      setTimeout(() => {
         dialog.value.title = ""
         dialog.value.body = h("div")
         dialog.value.class = "w-min"
      }, 50)
   }

   const toast = useToast()
   function notify(opts: Partial<Toast>) {
      toast.add(opts)
   }

   return {
      dialog,
      showDialog,
      closeDialog,
      notify
   }
})
