// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   ssr: false,
   modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],
   css: ["~/assets/css/main.css"],
   components: {
      dirs: [
         {
            path: "~/components",
            pathPrefix: false,
         },
      ],
   },
})
