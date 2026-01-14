<script setup lang="ts">
const appConfig = useAppConfig()
useHead({
   titleTemplate: (title) => {
      return title ? `${title} | ${appConfig.appName}` : appConfig.appName
   },
})

const appStore = useAppStore()
</script>

<template>
   <UApp>
      <NuxtRouteAnnouncer />
      <NuxtLayout>
         <NuxtPage />
      </NuxtLayout>
      <AppModal
         v-model="appStore.dialog.show"
         :title="appStore.dialog.title"
         :class="appStore.dialog.class"
      >
         <component :is="appStore.dialog.body" />
      </AppModal>
   </UApp>
</template>
