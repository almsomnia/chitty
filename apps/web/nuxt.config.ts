// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   ssr: false,
   modules: [
      "@nuxt/ui",
      "@pinia/nuxt",
      "@vueuse/nuxt",
      "dayjs-nuxt",
      "pinia-plugin-persistedstate/nuxt",
   ],
   nitro: {
      experimental: {
         websocket: true,
      },
   },
   css: ["~/assets/css/main.css"],
   components: {
      dirs: [
         {
            path: "~/components",
            pathPrefix: false,
         },
      ],
   },
   runtimeConfig: {
      apiUrl: import.meta.env.API_URL,
      public: {
         wsUrl: import.meta.env.WS_URL,
      }
   },
   dayjs: {
      defaultLocale: "en",
      locales: ["en", "id"],
      plugins: ["utc", "duration", "timezone", "relativeTime"],
      defaultTimezone: "Asia/Jakarta",
   },
})
