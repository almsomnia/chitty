<script setup lang="ts">
const menu = useAppConfig().menu
</script>

<template>
   <aside class="bg-default dark:bg-muted w-(--sidebar-width)">
      <div class="h-(--header-height)">
         <div class="flex items-center h-full px-4">
            <span class="font-bold">Chitty</span>
         </div>
      </div>
      <div class="h-full p-2">
         <UNavigationMenu
            orientation="vertical"
            :items="menu"
         />
      </div>
   </aside>
</template>
