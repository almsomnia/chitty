<script setup lang="ts">
import { type DropdownMenuItem } from "@nuxt/ui"

const menu = useAppConfig().menu
const authStore = useAuthStore()
const appStore = useAppStore()
const user = computed(() => authStore.user)
const colorMode = useColorMode()
const appName = useAppConfig().appName

const userDropdownMenu = computed<DropdownMenuItem[][]>(() => {
   return [
      [
         {
            label: "Profile",
            icon: "lucide:user",
         },
      ],
      [
         {
            label: "Log Out",
            icon: "lucide:log-out",
            onSelect: async () => {
               const res = await $api(`/api/auth/logout`, {
                  method: "post",
               })
               appStore.notify({
                  title: res.meta.message,
                  color: "info",
               })
               navigateTo("/login")
            },
            ui: {
               item: "text-error",
               itemLeadingIcon: "text-error",
            },
         },
      ],
   ]
})
</script>

<template>
   <UDashboardSidebar
      resizable
      collapsible
      class="bg-default dark:bg-elevated/25"
   >
      <template #header="{ collapsed }">
         <div class="flex items-center">
            <img
               v-if="colorMode.value == 'dark'"
               src="/img/nuxt-white.svg"
               class="size-8"
            />
            <img
               v-else
               src="/img/nuxt-black.svg"
               class="size-8"
            />
            <span
               v-if="!collapsed"
               class="ms-1 font-bold text-lg"
            >
               {{ appName }}
            </span>
         </div>
      </template>
      <template #default="{ collapsed }">
         <UNavigationMenu
            orientation="vertical"
            :items="menu"
         />
      </template>
      <template #footer="{ collapsed }">
         <UDropdownMenu
            :items="userDropdownMenu"
            arrow
            :ui="{ content: 'min-w-48' }"
         >
            <button
               class="text-start hover:bg-elevated/50 p-2 -m-2 mb-0 flex-1 rounded-lg"
            >
               <UUser
                  :avatar="{
                     src: 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
                  }"
                  :name="user?.name"
                  :description="user?.email"
                  :ui="{
                     name: collapsed ? 'hidden' : 'block',
                     description: collapsed ? 'hidden' : 'block',
                  }"
               />
            </button>
         </UDropdownMenu>
      </template>
   </UDashboardSidebar>
</template>
