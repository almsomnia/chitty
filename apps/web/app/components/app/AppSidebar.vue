<script setup lang="ts">
const menu = useAppConfig().menu
</script>

<template>
   <aside
      class="bg-default w-(--sidebar-width) mt-(--header-height)"
   >
      <div class="h-full p-2">
         <UNavigationMenu
            orientation="vertical"
            :items="menu"
         />
      </div>
   </aside>
</template>
