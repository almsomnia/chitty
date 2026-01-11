<script setup lang="ts">
const menu = useAppConfig().menu
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const colorMode = useColorMode()
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
               Chitty
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
      </template>
   </UDashboardSidebar>
</template>
